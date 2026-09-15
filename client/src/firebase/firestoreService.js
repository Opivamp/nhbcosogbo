// Cloud Firestore Service for Real-Time Multi-Device Synchronization
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { db } from './config.js';
import initialDb from '../data/db.json';

// Helper to sanitize local asset URLs
function sanitizeUrls(data) {
  if (!data) return data;
  if (typeof data === 'string') {
    if (data.startsWith('/uploads/') || data === '/nhbc-logo.png' || data === '/logo.png') {
      return '.' + data;
    }
    return data;
  }
  if (Array.isArray(data)) return data.map(sanitizeUrls);
  if (typeof data === 'object') {
    const res = {};
    for (const k of Object.keys(data)) {
      res[k] = sanitizeUrls(data[k]);
    }
    return res;
  }
  return data;
}

// -------------------------------------------------------------
// SEED INITIAL DATABASE IF EMPTY
// -------------------------------------------------------------
let isSeeded = false;

export async function ensureDatabaseSeeded() {
  if (isSeeded) return;
  try {
    const checkDoc = await getDoc(doc(db, 'siteSettings', 'main'));
    if (checkDoc.exists()) {
      isSeeded = true;
      return;
    }

    console.log('[Firestore] Seeding initial database from db.json...');
    
    // Seed SiteSettings
    await setDoc(doc(db, 'siteSettings', 'main'), sanitizeUrls(initialDb.siteSettings || {}));

    // Seed Gallery Categories
    await setDoc(doc(db, 'metadata', 'galleryCategories'), {
      categories: initialDb.galleryCategories || [
        'Sunday Services',
        'Worship & Choir',
        'Youth Ministry',
        'Children Ministry',
        'Community Outreach',
        'Special Events'
      ]
    });

    // Seed Gallery Images
    for (const img of (initialDb.galleryImages || [])) {
      await setDoc(doc(db, 'galleryImages', img.id), sanitizeUrls(img));
    }

    // Seed Sermons
    for (const s of (initialDb.sermons || [])) {
      await setDoc(doc(db, 'sermons', s.id), sanitizeUrls(s));
    }

    // Seed Events
    for (const ev of (initialDb.events || [])) {
      await setDoc(doc(db, 'events', ev.id), sanitizeUrls(ev));
    }

    // Seed News
    for (const n of (initialDb.news || [])) {
      await setDoc(doc(db, 'news', n.id), sanitizeUrls(n));
    }

    // Seed Ministries
    for (const m of (initialDb.ministries || [])) {
      await setDoc(doc(db, 'ministries', m.id), sanitizeUrls(m));
    }

    // Seed Leadership
    for (const l of (initialDb.leadership || [])) {
      await setDoc(doc(db, 'leadership', l.id), sanitizeUrls(l));
    }

    // Seed Users
    for (const u of (initialDb.users || [])) {
      await setDoc(doc(db, 'users', u.id), u);
    }

    isSeeded = true;
    console.log('[Firestore] Initial database seeded successfully!');
  } catch (err) {
    console.warn('[Firestore] Auto-seed check notice:', err.message);
  }
}

// -------------------------------------------------------------
// GENERIC HELPERS
// -------------------------------------------------------------
async function getCollectionDocs(colName) {
  try {
    const snap = await getDocs(collection(db, colName));
    const items = [];
    snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
    return items;
  } catch (err) {
    console.error(`[Firestore] Error fetching ${colName}:`, err);
    return [];
  }
}

// -------------------------------------------------------------
// GALLERY
// -------------------------------------------------------------
export async function getGallery(category = 'All') {
  await ensureDatabaseSeeded();
  try {
    const [imagesSnap, catSnap] = await Promise.all([
      getDocs(collection(db, 'galleryImages')),
      getDoc(doc(db, 'metadata', 'galleryCategories'))
    ]);

    let images = [];
    imagesSnap.forEach(d => images.push({ id: d.id, ...d.data() }));

    // Sort by createdAt or date desc
    images.sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));

    if (category && category !== 'All') {
      images = images.filter(img => img.category?.toLowerCase() === category.toLowerCase());
    }

    const categories = catSnap.exists() && catSnap.data().categories
      ? ['All', ...catSnap.data().categories.filter(c => c !== 'All')]
      : ['All', 'Sunday Services', 'Worship & Choir', 'Youth Ministry', 'Children Ministry', 'Community Outreach', 'Special Events'];

    return { categories, images: sanitizeUrls(images) };
  } catch (err) {
    console.error('[Firestore] getGallery error:', err);
    return { categories: ['All'], images: [] };
  }
}

export async function addGalleryImage(imgData) {
  const id = imgData.id || 'img-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
  const docData = {
    ...imgData,
    id,
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, 'galleryImages', id), docData);
  return docData;
}

export async function updateGalleryImage(id, data) {
  const ref = doc(db, 'galleryImages', id);
  await updateDoc(ref, data);
  return { id, ...data };
}

export async function deleteGalleryImage(id) {
  await deleteDoc(doc(db, 'galleryImages', id));
  return { success: true };
}

export async function addGalleryCategory(name) {
  const catRef = doc(db, 'metadata', 'galleryCategories');
  const snap = await getDoc(catRef);
  let categories = ['Sunday Services', 'Worship & Choir', 'Youth Ministry', 'Children Ministry', 'Community Outreach', 'Special Events'];
  if (snap.exists() && snap.data().categories) {
    categories = snap.data().categories;
  }
  if (!categories.includes(name)) {
    categories.push(name);
    await setDoc(catRef, { categories });
  }
  return { categories };
}

// -------------------------------------------------------------
// SERMONS
// -------------------------------------------------------------
export async function getSermons(params = {}) {
  await ensureDatabaseSeeded();
  const items = await getCollectionDocs('sermons');
  items.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  let list = items;
  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(s => 
      (s.title + ' ' + (s.speaker || s.preacher || '') + ' ' + (s.scripture || '')).toLowerCase().includes(q)
    );
  }
  if (params.speaker) {
    list = list.filter(s => (s.speaker || s.preacher) === params.speaker);
  }
  if (params.category && params.category !== 'All') {
    list = list.filter(s => s.category === params.category);
  }
  return sanitizeUrls(list);
}

export async function createSermon(data) {
  const id = 'srm-' + Date.now();
  const newSermon = {
    ...data,
    id,
    speaker: data.preacher || data.speaker || 'Revd. [Pastor Name]',
    preacher: data.preacher || data.speaker || 'Revd. [Pastor Name]',
    thumbnailUrl: data.thumbnailUrl || './uploads/sermon-faith.svg',
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, 'sermons', id), newSermon);
  return newSermon;
}

export async function updateSermon(id, data) {
  const ref = doc(db, 'sermons', id);
  if (data.preacher) data.speaker = data.preacher;
  await updateDoc(ref, data);
  return { id, ...data };
}

export async function deleteSermon(id) {
  await deleteDoc(doc(db, 'sermons', id));
  return { success: true };
}

// -------------------------------------------------------------
// EVENTS
// -------------------------------------------------------------
export async function getEvents(params = {}) {
  await ensureDatabaseSeeded();
  const items = await getCollectionDocs('events');
  items.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
  return sanitizeUrls(items);
}

export async function createEvent(data) {
  const id = 'evt-' + Date.now();
  const newEvent = {
    ...data,
    id,
    category: data.category || 'Spiritual Revival',
    date: data.date || new Date().toISOString().split('T')[0],
    time: data.time || '9:00 AM',
    location: data.location || 'Church Sanctuary, Osogbo',
    description: data.description || '',
    imageUrl: data.imageUrl || './uploads/annual-convention.svg',
    status: data.status || 'upcoming',
    featured: Boolean(data.featured),
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, 'events', id), newEvent);
  return newEvent;
}

export async function updateEvent(id, data) {
  const ref = doc(db, 'events', id);
  await updateDoc(ref, data);
  return { id, ...data };
}

export async function deleteEvent(id) {
  await deleteDoc(doc(db, 'events', id));
  return { success: true };
}

// -------------------------------------------------------------
// NEWS & BULLETINS
// -------------------------------------------------------------
export async function getNews() {
  await ensureDatabaseSeeded();
  const items = await getCollectionDocs('news');
  items.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  return sanitizeUrls(items);
}

export async function getNewsItem(slug) {
  await ensureDatabaseSeeded();
  const items = await getCollectionDocs('news');
  const found = items.find(n => n.slug === slug || n.id === slug);
  if (!found) throw new Error('News item not found');
  return sanitizeUrls(found);
}

export async function createNews(data) {
  const id = 'news-' + Date.now();
  const slug = (data.title || 'news')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
  const newItem = {
    ...data,
    id,
    slug,
    category: data.category || 'Announcement',
    date: data.date || new Date().toISOString().split('T')[0],
    excerpt: data.excerpt || '',
    content: data.content || data.excerpt || '',
    imageUrl: data.image || data.imageUrl || './uploads/annual-convention.svg',
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, 'news', id), newItem);
  return newItem;
}

export async function updateNews(id, data) {
  const ref = doc(db, 'news', id);
  await updateDoc(ref, data);
  return { id, ...data };
}

export async function deleteNews(id) {
  await deleteDoc(doc(db, 'news', id));
  return { success: true };
}

// -------------------------------------------------------------
// MINISTRIES
// -------------------------------------------------------------
export async function getMinistries() {
  await ensureDatabaseSeeded();
  const items = await getCollectionDocs('ministries');
  return sanitizeUrls(items);
}

export async function getMinistry(slug) {
  await ensureDatabaseSeeded();
  const items = await getCollectionDocs('ministries');
  const found = items.find(m => m.slug === slug || m.id === slug);
  if (!found) throw new Error('Ministry not found');
  return sanitizeUrls(found);
}

export async function createMinistry(data) {
  const id = 'min-' + Date.now();
  const slug = data.slug || (data.name || 'ministry').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const newMin = {
    ...data,
    id,
    slug,
    name: data.name,
    description: data.description || '',
    meetingTime: data.meetingTime || 'Sundays after service',
    leader: data.leader || 'Ministry Coordinator',
    icon: data.icon || 'Users',
    imageUrl: data.imageUrl || './uploads/hero-sanctuary.svg',
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, 'ministries', id), newMin);
  return newMin;
}

export async function updateMinistry(id, data) {
  const ref = doc(db, 'ministries', id);
  await updateDoc(ref, data);
  return { id, ...data };
}

export async function deleteMinistry(id) {
  await deleteDoc(doc(db, 'ministries', id));
  return { success: true };
}

// -------------------------------------------------------------
// LEADERSHIP
// -------------------------------------------------------------
export async function getLeadership() {
  await ensureDatabaseSeeded();
  const items = await getCollectionDocs('leadership');
  items.sort((a, b) => (a.order || 99) - (b.order || 99));
  return sanitizeUrls(items);
}

export async function createLeader(data) {
  const id = 'lead-' + Date.now();
  const newLead = {
    ...data,
    id,
    name: data.name,
    role: data.role || 'Church Leader',
    bio: data.bio || '',
    image: data.image || data.imageUrl || './uploads/pastoral-welcome.svg',
    imageUrl: data.image || data.imageUrl || './uploads/pastoral-welcome.svg',
    contact: data.contact || '',
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, 'leadership', id), newLead);
  return newLead;
}

export async function updateLeader(id, data) {
  const ref = doc(db, 'leadership', id);
  if (data.image) data.imageUrl = data.image;
  await updateDoc(ref, data);
  return { id, ...data };
}

export async function deleteLeader(id) {
  await deleteDoc(doc(db, 'leadership', id));
  return { success: true };
}

// -------------------------------------------------------------
// SITE SETTINGS
// -------------------------------------------------------------
export async function getSiteSettings() {
  await ensureDatabaseSeeded();
  try {
    const snap = await getDoc(doc(db, 'siteSettings', 'main'));
    if (snap.exists()) {
      return sanitizeUrls(snap.data());
    }
  } catch (err) {
    console.warn('[Firestore] Error reading siteSettings:', err);
  }
  return sanitizeUrls(initialDb.siteSettings || {});
}

export async function updateSiteSettings(section, data) {
  const ref = doc(db, 'siteSettings', 'main');
  const snap = await getDoc(ref);
  let current = snap.exists() ? snap.data() : {};
  if (section === 'general') {
    current = { ...current, ...data };
  } else {
    current[section] = data;
  }
  await setDoc(ref, current);
  return current;
}

// -------------------------------------------------------------
// HOMEPAGE AGGREGATE
// -------------------------------------------------------------
export async function getHomepage() {
  await ensureDatabaseSeeded();
  const [settings, events, sermons, gallery, news, ministries] = await Promise.all([
    getSiteSettings(),
    getEvents(),
    getSermons(),
    getGallery(),
    getNews(),
    getMinistries()
  ]);

  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 4);
  const featuredSermon = sermons.find(s => s.featured) || sermons[0] || null;
  const previewGallery = (gallery.images || []).slice(0, 8);
  const featuredNews = news.slice(0, 3);
  const rawServices = settings?.serviceTimes;
  const serviceTimes = Array.isArray(rawServices) && rawServices.length > 0
    ? rawServices
    : (rawServices && typeof rawServices === 'object')
      ? Object.values(rawServices).filter(x => typeof x === 'object' && x !== null && x.name)
      : [];

  return {
    siteSettings: settings,
    serviceTimes,
    scripture: settings?.scripture || {},
    upcomingEvents,
    featuredSermon,
    previewGallery,
    featuredNews,
    ministries: ministries.slice(0, 6)
  };
}

// -------------------------------------------------------------
// ABOUT AGGREGATE
// -------------------------------------------------------------
export async function getAbout() {
  await ensureDatabaseSeeded();
  const [settings, leadership] = await Promise.all([
    getSiteSettings(),
    getLeadership()
  ]);
  return {
    about: settings?.about || {},
    leadership
  };
}

// -------------------------------------------------------------
// PRAYER REQUESTS & MESSAGES
// -------------------------------------------------------------
export async function getPrayerRequests() {
  await ensureDatabaseSeeded();
  const items = await getCollectionDocs('prayerRequests');
  items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return items;
}

export async function addPrayerRequest(data) {
  const id = 'pr-' + Date.now();
  const docData = {
    ...data,
    id,
    status: 'new',
    handled: false,
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, 'prayerRequests', id), docData);
  return docData;
}

export async function handlePrayerRequest(id, data) {
  const ref = doc(db, 'prayerRequests', id);
  const payload = { ...data, handled: true };
  await updateDoc(ref, payload);
  return { id, ...payload };
}

export async function deletePrayerRequest(id) {
  await deleteDoc(doc(db, 'prayerRequests', id));
  return { success: true };
}

export async function getContactMessages() {
  await ensureDatabaseSeeded();
  const items = await getCollectionDocs('contactMessages');
  items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return items;
}

export async function addContactMessage(data) {
  const id = 'msg-' + Date.now();
  const docData = {
    ...data,
    id,
    read: false,
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, 'contactMessages', id), docData);
  return docData;
}

export async function markMessageRead(id, read = true) {
  const ref = doc(db, 'contactMessages', id);
  await updateDoc(ref, { read });
  return { id, read };
}

export async function deleteContactMessage(id) {
  await deleteDoc(doc(db, 'contactMessages', id));
  return { success: true };
}

// -------------------------------------------------------------
// STAFF USERS
// -------------------------------------------------------------
export async function getUsers() {
  await ensureDatabaseSeeded();
  const items = await getCollectionDocs('users');
  return items.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt }));
}

export async function createUser(data) {
  const id = 'u-' + Date.now();
  const newUser = {
    id,
    name: data.name,
    email: data.email,
    passwordHash: data.password || 'temporary',
    role: data.role || 'contentadmin',
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, 'users', id), newUser);
  return newUser;
}

export async function deleteUser(id) {
  await deleteDoc(doc(db, 'users', id));
  return { success: true };
}

export async function getStats() {
  await ensureDatabaseSeeded();
  const [sermons, events, gallery, news, prayers, messages] = await Promise.all([
    getSermons(),
    getEvents(),
    getGallery(),
    getNews(),
    getPrayerRequests(),
    getContactMessages()
  ]);

  return {
    totalSermons: sermons.length,
    totalEvents: events.length,
    totalPhotos: (gallery.images || []).length,
    totalNews: news.length,
    pendingPrayers: prayers.filter(p => !p.handled).length,
    unreadMessages: messages.filter(m => !m.read).length
  };
}
