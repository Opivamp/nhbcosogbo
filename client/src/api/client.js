import initialDb from '../data/db.json';

const API_BASE = '/api';
const DB_STORAGE_KEY = 'nhbc_local_database_v3';

export function getToken() {
  return localStorage.getItem('nhbc_token');
}

export function setToken(token) {
  if (token) localStorage.setItem('nhbc_token', token);
  else localStorage.removeItem('nhbc_token');
}

export function getUser() {
  const user = localStorage.getItem('nhbc_user');
  return user ? JSON.parse(user) : null;
}

export function setUser(user) {
  if (user) localStorage.setItem('nhbc_user', JSON.stringify(user));
  else localStorage.removeItem('nhbc_user');
}

function sanitizeAssetUrls(data) {
  if (!data) return data;
  if (typeof data === 'string') {
    if (data.startsWith('/uploads/') || data === '/nhbc-logo.png' || data === '/logo.png') {
      return '.' + data;
    }
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeAssetUrls);
  }
  if (typeof data === 'object') {
    const res = {};
    for (const key of Object.keys(data)) {
      res[key] = sanitizeAssetUrls(data[key]);
    }
    return res;
  }
  return data;
}

// Local mock database helpers for static hosting (GitHub Pages)
function getDb() {
  try {
    const cached = localStorage.getItem(DB_STORAGE_KEY);
    if (cached) {
      return sanitizeAssetUrls(JSON.parse(cached));
    }
  } catch (e) {
    console.warn('Could not read from localStorage, using initialDb');
  }
  const cloned = sanitizeAssetUrls(JSON.parse(JSON.stringify(initialDb)));
  saveDb(cloned);
  return cloned;
}

function saveDb(db) {
  try {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn('Could not save to localStorage', e);
  }
}

// Helper to convert uploaded File object to optimized Base64 data URL
async function fileToDataUrl(file) {
  return new Promise((resolve) => {
    if (!file || !(file instanceof Blob)) {
      return resolve('./uploads/hero-sanctuary.svg');
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (file.type && file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          try {
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          } catch (e) {
            resolve(result);
          }
        };
        img.onerror = () => resolve(result);
        img.src = result;
      } else {
        resolve(result);
      }
    };
    reader.onerror = () => resolve('./uploads/hero-sanctuary.svg');
    reader.readAsDataURL(file);
  });
}

async function request(endpoint, options = {}) {
  const headers = options.headers || {};
  const token = getToken();

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.ok) {
      return await response.json().catch(() => ({}));
    }
  } catch (err) {
    // Network failure (e.g. running on GitHub Pages without a backend)
  }

  // Fallback to local embedded database with full CRUD and persistence
  return await fallbackHandler(endpoint, options);
}

async function fallbackHandler(endpoint, options = {}) {
  const db = getDb();
  const method = (options.method || 'GET').toUpperCase();
  let body = {};
  const uploadedFiles = [];

  if (options.body) {
    if (options.body instanceof FormData) {
      for (const [key, val] of options.body.entries()) {
        if (val instanceof File) {
          uploadedFiles.push(val);
        } else {
          body[key] = val;
        }
      }
    } else if (typeof options.body === 'string') {
      try { body = JSON.parse(options.body); } catch(e) {}
    } else if (typeof options.body === 'object') {
      body = options.body;
    }
  }

  // -------------------------------------------------------------
  // 1. PUBLIC ROUTES
  // -------------------------------------------------------------
  if (endpoint === '/homepage') {
    const upcomingEvents = (db.events || []).filter(e => e.status === 'upcoming').slice(0, 4);
    const featuredSermon = (db.sermons || []).find(s => s.featured) || db.sermons[0] || null;
    const previewGallery = (db.galleryImages || []).slice(0, 8);
    const featuredNews = (db.news || []).slice(0, 3);
    const rawServices = db.siteSettings?.serviceTimes;
    const serviceTimes = Array.isArray(rawServices) && rawServices.length > 0
      ? rawServices
      : (rawServices && typeof rawServices === 'object')
        ? Object.values(rawServices).filter(x => typeof x === 'object' && x !== null && x.name)
        : [];
    return {
      siteSettings: db.siteSettings,
      serviceTimes,
      scripture: db.siteSettings?.scripture || {},
      upcomingEvents,
      featuredSermon,
      previewGallery,
      featuredNews,
      ministries: (db.ministries || []).slice(0, 6)
    };
  }

  if (endpoint === '/site-settings') {
    return db.siteSettings || {};
  }

  if (endpoint === '/about') {
    return {
      about: db.siteSettings?.about || {},
      leadership: db.leadership || []
    };
  }

  if (endpoint === '/ministries') {
    return db.ministries || [];
  }

  if (endpoint.startsWith('/ministries/')) {
    const slug = endpoint.replace('/ministries/', '');
    const m = (db.ministries || []).find(x => x.slug === slug);
    if (!m) throw new Error('Ministry not found');
    return m;
  }

  if (endpoint.startsWith('/sermons')) {
    const url = new URL('http://local' + endpoint);
    let list = db.sermons || [];
    const search = url.searchParams.get('search');
    const speaker = url.searchParams.get('speaker');
    const category = url.searchParams.get('category');
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => (s.title + ' ' + (s.speaker || s.preacher || '') + ' ' + (s.scripture || '')).toLowerCase().includes(q));
    }
    if (speaker) list = list.filter(s => (s.speaker || s.preacher) === speaker);
    if (category && category !== 'All') list = list.filter(s => s.category === category);
    return list;
  }

  if (endpoint.startsWith('/events')) {
    return db.events || [];
  }

  if (endpoint.startsWith('/gallery')) {
    const url = new URL('http://local' + endpoint);
    const cat = url.searchParams.get('category');
    let list = db.galleryImages || [];
    if (cat && cat !== 'All') {
      list = list.filter(img => img.category?.toLowerCase() === cat.toLowerCase());
    }
    const defaultCategories = [
      'Sunday Services',
      'Worship & Choir',
      'Youth Ministry',
      'Children Ministry',
      'Community Outreach',
      'Special Events'
    ];
    const categories = db.galleryCategories && db.galleryCategories.length > 0
      ? db.galleryCategories
      : defaultCategories;

    return {
      categories: ['All', ...categories.filter(c => c !== 'All')],
      images: list
    };
  }

  if (endpoint === '/news') {
    return db.news || [];
  }

  if (endpoint.startsWith('/news/')) {
    const slug = endpoint.replace('/news/', '');
    const n = (db.news || []).find(x => x.slug === slug);
    if (!n) throw new Error('News item not found');
    return n;
  }

  if (endpoint === '/giving') {
    return db.siteSettings?.giving || {};
  }

  if (endpoint === '/order-of-service') {
    return db.siteSettings?.orderOfService || [];
  }

  if (endpoint === '/giving/notify' && method === 'POST') {
    if (!db.givingNotifications) db.givingNotifications = [];
    const newNotif = {
      id: 'gn-' + Date.now(),
      ...body,
      createdAt: new Date().toISOString()
    };
    db.givingNotifications.unshift(newNotif);
    saveDb(db);
    return { success: true, message: 'Thank you! Your giving notification has been recorded for church financial stewardship.' };
  }

  if (endpoint === '/prayer-requests' && method === 'POST') {
    if (!db.prayerRequests) db.prayerRequests = [];
    const newReq = {
      id: 'pr-' + Date.now(),
      ...body,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    db.prayerRequests.unshift(newReq);
    saveDb(db);
    return { success: true, message: 'Your prayer request has been confidentially submitted to the pastorate. God bless you.' };
  }

  if (endpoint === '/contact' && method === 'POST') {
    if (!db.contactMessages) db.contactMessages = [];
    const newMsg = {
      id: 'msg-' + Date.now(),
      ...body,
      read: false,
      createdAt: new Date().toISOString()
    };
    db.contactMessages.unshift(newMsg);
    saveDb(db);
    return { success: true, message: 'Your message has been sent to the church administration. We will get back to you shortly.' };
  }

  // -------------------------------------------------------------
  // 2. AUTH ROUTES
  // -------------------------------------------------------------
  if (endpoint === '/auth/login' && method === 'POST') {
    const email = (body.email || '').toLowerCase().trim();
    const password = body.password || '';

    const user = (db.users || []).find(u => u.email.toLowerCase() === email);
    let role = 'superadmin';
    let name = 'Senior Pastor Administrator';

    if (user) {
      role = user.role;
      name = user.name;
    } else if (email.includes('editor')) {
      role = 'contentadmin';
      name = 'Media & Content Editor';
    } else if (email.includes('prayer')) {
      role = 'prayeradmin';
      name = 'Prayer Ministry Coordinator';
    }

    const authUser = {
      id: user?.id || 'u-' + Date.now(),
      name,
      email: email || 'admin@nhbcosogbo.org',
      role
    };

    const token = 'nhbc-static-jwt-' + Date.now();
    setToken(token);
    setUser(authUser);
    return { token, user: authUser };
  }

  if (endpoint === '/auth/me') {
    const u = getUser();
    if (u) return { user: u };
    throw new Error('Not authenticated');
  }

  // -------------------------------------------------------------
  // 3. ADMIN STATS
  // -------------------------------------------------------------
  if (endpoint === '/admin/stats') {
    const unhandledPrayers = (db.prayerRequests || []).filter(p => !p.handled && p.status !== 'answered').length;
    const unreadMessages = (db.contactMessages || []).filter(m => !m.read).length;

    return {
      galleryCount: (db.galleryImages || []).length,
      totalImages: (db.galleryImages || []).length,
      galleryImages: (db.galleryImages || []).length,

      sermonsCount: (db.sermons || []).length,
      totalSermons: (db.sermons || []).length,
      sermons: (db.sermons || []).length,

      eventsCount: (db.events || []).length,
      totalEvents: (db.events || []).length,
      events: (db.events || []).length,

      ministriesCount: (db.ministries || []).length,
      totalMinistries: (db.ministries || []).length,
      ministries: (db.ministries || []).length,

      newsCount: (db.news || []).length,
      totalNews: (db.news || []).length,
      news: (db.news || []).length,

      prayersCount: (db.prayerRequests || []).length,
      prayerRequests: (db.prayerRequests || []).length,
      pendingPrayers: unhandledPrayers,
      unhandledPrayers: unhandledPrayers,

      messagesCount: (db.contactMessages || []).length,
      unreadMessages: unreadMessages
    };
  }

  // -------------------------------------------------------------
  // 4. GALLERY ADMIN (Upload, Edit, Delete, Categories)
  // -------------------------------------------------------------
  if (endpoint === '/admin/gallery/upload' && method === 'POST') {
    db.galleryImages = db.galleryImages || [];
    const createdItems = [];

    if (uploadedFiles.length > 0) {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        const dataUrl = await fileToDataUrl(file);
        const item = {
          id: 'gal-' + Date.now() + '-' + i,
          title: body.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          caption: body.description || body.caption || '',
          description: body.description || body.caption || '',
          category: body.category || 'Sunday Services',
          event: body.event || '',
          date: body.date || new Date().toISOString().split('T')[0],
          imageUrl: dataUrl,
          url: dataUrl,
          featured: body.featured === 'true' || body.featured === true,
          order: 1
        };
        db.galleryImages.unshift(item);
        createdItems.push(item);
      }
    } else {
      const item = {
        id: 'gal-' + Date.now(),
        title: body.title || 'Church Photograph',
        caption: body.description || body.caption || '',
        description: body.description || body.caption || '',
        category: body.category || 'Sunday Services',
        date: body.date || new Date().toISOString().split('T')[0],
        imageUrl: body.imageUrl || body.url || './uploads/hero-sanctuary.svg',
        url: body.imageUrl || body.url || './uploads/hero-sanctuary.svg',
        featured: false,
        order: 1
      };
      db.galleryImages.unshift(item);
      createdItems.push(item);
    }

    saveDb(db);
    return {
      message: `Successfully uploaded ${createdItems.length} photograph(s)!`,
      uploaded: createdItems,
      items: createdItems
    };
  }

  if (endpoint.startsWith('/admin/gallery/') && method === 'PUT') {
    const id = endpoint.replace('/admin/gallery/', '');
    const item = (db.galleryImages || []).find(g => g.id === id);
    if (!item) throw new Error('Gallery image not found');
    Object.assign(item, body);
    saveDb(db);
    return { message: 'Gallery image updated successfully.', item };
  }

  if (endpoint.startsWith('/admin/gallery/') && method === 'DELETE') {
    const id = endpoint.replace('/admin/gallery/', '');
    db.galleryImages = (db.galleryImages || []).filter(g => g.id !== id);
    saveDb(db);
    return { message: 'Photo deleted successfully.' };
  }

  if (endpoint === '/admin/gallery/categories' && method === 'POST') {
    db.galleryCategories = db.galleryCategories || [
      'Sunday Services', 'Worship & Choir', 'Youth Ministry', 'Children Ministry', 'Community Outreach', 'Special Events'
    ];
    const name = (body.name || '').trim();
    if (name && !db.galleryCategories.includes(name)) {
      db.galleryCategories.push(name);
      saveDb(db);
    }
    return db.galleryCategories;
  }

  // -------------------------------------------------------------
  // 5. SERMONS ADMIN (Create, Edit, Delete)
  // -------------------------------------------------------------
  if (endpoint === '/admin/sermons' && method === 'POST') {
    db.sermons = db.sermons || [];
    const newSermon = {
      id: 'srm-' + Date.now(),
      title: body.title,
      speaker: body.preacher || body.speaker || 'Revd. Pastor',
      preacher: body.preacher || body.speaker || 'Revd. Pastor',
      scripture: body.scripture || '',
      date: body.date || new Date().toISOString().split('T')[0],
      series: body.series || 'Sunday Worship Service',
      category: body.category || 'Sunday Service',
      description: body.description || '',
      videoUrl: body.videoUrl || '',
      audioUrl: body.audioUrl || '',
      thumbnailUrl: body.thumbnailUrl || './uploads/sermon-faith.svg',
      featured: Boolean(body.featured)
    };
    db.sermons.unshift(newSermon);
    saveDb(db);
    return newSermon;
  }

  if (endpoint.startsWith('/admin/sermons/') && method === 'PUT') {
    const id = endpoint.replace('/admin/sermons/', '');
    const sermon = (db.sermons || []).find(s => s.id === id);
    if (!sermon) throw new Error('Sermon not found');
    Object.assign(sermon, body);
    if (body.preacher) sermon.speaker = body.preacher;
    saveDb(db);
    return sermon;
  }

  if (endpoint.startsWith('/admin/sermons/') && method === 'DELETE') {
    const id = endpoint.replace('/admin/sermons/', '');
    db.sermons = (db.sermons || []).filter(s => s.id !== id);
    saveDb(db);
    return { success: true, message: 'Sermon deleted successfully.' };
  }

  // -------------------------------------------------------------
  // 6. EVENTS ADMIN (Create, Edit, Delete)
  // -------------------------------------------------------------
  if (endpoint === '/admin/events' && method === 'POST') {
    db.events = db.events || [];
    const newEvent = {
      id: 'evt-' + Date.now(),
      title: body.title,
      category: body.category || 'Spiritual Revival',
      date: body.date || new Date().toISOString().split('T')[0],
      time: body.time || '9:00 AM',
      location: body.location || 'Church Auditorium, Osogbo',
      description: body.description || '',
      imageUrl: body.imageUrl || './uploads/annual-convention.svg',
      status: body.status || 'upcoming',
      featured: Boolean(body.featured)
    };
    db.events.unshift(newEvent);
    saveDb(db);
    return newEvent;
  }

  if (endpoint.startsWith('/admin/events/') && method === 'PUT') {
    const id = endpoint.replace('/admin/events/', '');
    const ev = (db.events || []).find(e => e.id === id);
    if (!ev) throw new Error('Event not found');
    Object.assign(ev, body);
    saveDb(db);
    return ev;
  }

  if (endpoint.startsWith('/admin/events/') && method === 'DELETE') {
    const id = endpoint.replace('/admin/events/', '');
    db.events = (db.events || []).filter(e => e.id !== id);
    saveDb(db);
    return { success: true, message: 'Event deleted successfully.' };
  }

  // -------------------------------------------------------------
  // 7. NEWS & BULLETINS ADMIN (Create, Edit, Delete)
  // -------------------------------------------------------------
  if (endpoint === '/admin/news' && method === 'POST') {
    db.news = db.news || [];
    const slug = (body.title || 'news')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    const newNews = {
      id: 'news-' + Date.now(),
      slug,
      title: body.title,
      category: body.category || 'Announcement',
      date: body.date || new Date().toISOString().split('T')[0],
      excerpt: body.excerpt || '',
      content: body.content || body.excerpt || '',
      imageUrl: body.image || body.imageUrl || './uploads/annual-convention.svg'
    };
    db.news.unshift(newNews);
    saveDb(db);
    return newNews;
  }

  if (endpoint.startsWith('/admin/news/') && method === 'PUT') {
    const id = endpoint.replace('/admin/news/', '');
    const item = (db.news || []).find(n => n.id === id);
    if (!item) throw new Error('News item not found');
    Object.assign(item, body);
    saveDb(db);
    return item;
  }

  if (endpoint.startsWith('/admin/news/') && method === 'DELETE') {
    const id = endpoint.replace('/admin/news/', '');
    db.news = (db.news || []).filter(n => n.id !== id);
    saveDb(db);
    return { success: true, message: 'News item deleted successfully.' };
  }

  // -------------------------------------------------------------
  // 8. MINISTRIES ADMIN (Create, Edit, Delete)
  // -------------------------------------------------------------
  if (endpoint === '/admin/ministries' && method === 'POST') {
    db.ministries = db.ministries || [];
    const slug = body.slug || (body.name || 'ministry')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newMin = {
      id: 'min-' + Date.now(),
      slug,
      name: body.name,
      description: body.description || '',
      meetingTime: body.meetingTime || 'Sundays after service',
      leader: body.leader || 'Ministry Coordinator',
      icon: body.icon || 'Users',
      imageUrl: body.imageUrl || './uploads/hero-sanctuary.svg'
    };
    db.ministries.push(newMin);
    saveDb(db);
    return newMin;
  }

  if (endpoint.startsWith('/admin/ministries/') && method === 'PUT') {
    const id = endpoint.replace('/admin/ministries/', '');
    const min = (db.ministries || []).find(m => m.id === id);
    if (!min) throw new Error('Ministry not found');
    Object.assign(min, body);
    saveDb(db);
    return min;
  }

  if (endpoint.startsWith('/admin/ministries/') && method === 'DELETE') {
    const id = endpoint.replace('/admin/ministries/', '');
    db.ministries = (db.ministries || []).filter(m => m.id !== id);
    saveDb(db);
    return { success: true, message: 'Ministry deleted successfully.' };
  }

  // -------------------------------------------------------------
  // 9. LEADERSHIP ADMIN (Create, Edit, Delete)
  // -------------------------------------------------------------
  if (endpoint === '/admin/leadership' && method === 'POST') {
    db.leadership = db.leadership || [];
    const newLead = {
      id: 'lead-' + Date.now(),
      name: body.name,
      role: body.role || 'Church Leader',
      bio: body.bio || '',
      image: body.image || body.imageUrl || './uploads/pastoral-welcome.svg',
      imageUrl: body.image || body.imageUrl || './uploads/pastoral-welcome.svg',
      contact: body.contact || '',
      order: db.leadership.length + 1
    };
    db.leadership.push(newLead);
    saveDb(db);
    return newLead;
  }

  if (endpoint.startsWith('/admin/leadership/') && method === 'PUT') {
    const id = endpoint.replace('/admin/leadership/', '');
    const leader = (db.leadership || []).find(l => l.id === id);
    if (!leader) throw new Error('Leader not found');
    Object.assign(leader, body);
    if (body.image) leader.imageUrl = body.image;
    saveDb(db);
    return leader;
  }

  if (endpoint.startsWith('/admin/leadership/') && method === 'DELETE') {
    const id = endpoint.replace('/admin/leadership/', '');
    db.leadership = (db.leadership || []).filter(l => l.id !== id);
    saveDb(db);
    return { success: true, message: 'Leader deleted successfully.' };
  }

  // -------------------------------------------------------------
  // 10. SITE SETTINGS
  // -------------------------------------------------------------
  if (endpoint.startsWith('/admin/settings/') && method === 'PUT') {
    const section = endpoint.replace('/admin/settings/', '');
    if (!db.siteSettings) db.siteSettings = {};
    if (section === 'general') {
      db.siteSettings = { ...db.siteSettings, ...body };
    } else {
      db.siteSettings[section] = body;
    }
    saveDb(db);
    return db.siteSettings;
  }

  // -------------------------------------------------------------
  // 11. PRAYER REQUESTS & MESSAGES INBOX
  // -------------------------------------------------------------
  if (endpoint === '/admin/prayer-requests') {
    return db.prayerRequests || [];
  }

  if (endpoint.startsWith('/admin/prayer-requests/') && endpoint.endsWith('/handle')) {
    const id = endpoint.split('/')[3];
    const item = (db.prayerRequests || []).find(p => p.id === id);
    if (item) {
      Object.assign(item, body);
      item.handled = true;
      saveDb(db);
    }
    return item || { success: true };
  }

  if (endpoint.startsWith('/admin/prayer-requests/') && method === 'DELETE') {
    const id = endpoint.split('/')[3];
    db.prayerRequests = (db.prayerRequests || []).filter(p => p.id !== id);
    saveDb(db);
    return { success: true };
  }

  if (endpoint === '/admin/messages') {
    return db.contactMessages || [];
  }

  if (endpoint.startsWith('/admin/messages/') && endpoint.endsWith('/read')) {
    const id = endpoint.split('/')[3];
    const msg = (db.contactMessages || []).find(m => m.id === id);
    if (msg) {
      msg.read = body.read !== undefined ? body.read : true;
      saveDb(db);
    }
    return msg || { success: true };
  }

  if (endpoint.startsWith('/admin/messages/') && method === 'DELETE') {
    const id = endpoint.split('/')[3];
    db.contactMessages = (db.contactMessages || []).filter(m => m.id !== id);
    saveDb(db);
    return { success: true };
  }

  // -------------------------------------------------------------
  // 12. STAFF ACCOUNTS
  // -------------------------------------------------------------
  if (endpoint === '/admin/users') {
    if (method === 'GET') {
      return (db.users || []).map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt }));
    }
    if (method === 'POST') {
      const newUser = {
        id: 'u-' + Date.now(),
        name: body.name,
        email: body.email,
        role: body.role || 'contentadmin',
        createdAt: new Date().toISOString()
      };
      if (!db.users) db.users = [];
      db.users.push(newUser);
      saveDb(db);
      return newUser;
    }
  }

  if (endpoint.startsWith('/admin/users/') && method === 'DELETE') {
    const id = endpoint.split('/')[3];
    db.users = (db.users || []).filter(u => u.id !== id);
    saveDb(db);
    return { success: true };
  }

  // Fallback
  return { success: true };
}

export const api = {
  getHomepage: () => request('/homepage'),
  getSiteSettings: () => request('/site-settings'),
  getAbout: () => request('/about'),
  getMinistries: () => request('/ministries'),
  getMinistry: (slug) => request(`/ministries/${slug}`),
  getSermons: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/sermons${query ? '?' + query : ''}`);
  },
  getEvents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/events${query ? '?' + query : ''}`);
  },
  getGallery: (category = 'All') => request(`/gallery?category=${encodeURIComponent(category)}`),
  getNews: () => request('/news'),
  getNewsItem: (slug) => request(`/news/${slug}`),
  getGiving: () => request('/giving'),
  submitPrayerRequest: (data) => request('/prayer-requests', { method: 'POST', body: JSON.stringify(data) }),
  submitContact: (data) => request('/contact', { method: 'POST', body: JSON.stringify(data) }),

  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getMe: () => request('/auth/me'),

  getStats: () => request('/admin/stats'),
  uploadGallery: (formData) => request('/admin/gallery/upload', { method: 'POST', body: formData }),
  updateGalleryImage: (id, data) => request(`/admin/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGalleryImage: (id) => request(`/admin/gallery/${id}`, { method: 'DELETE' }),
  addGalleryCategory: (name) => request('/admin/gallery/categories', { method: 'POST', body: JSON.stringify({ name }) }),

  createSermon: (data) => request('/admin/sermons', { method: 'POST', body: JSON.stringify(data) }),
  updateSermon: (id, data) => request(`/admin/sermons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSermon: (id) => request(`/admin/sermons/${id}`, { method: 'DELETE' }),

  createEvent: (data) => request('/admin/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id, data) => request(`/admin/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEvent: (id) => request(`/admin/events/${id}`, { method: 'DELETE' }),

  createNews: (data) => request('/admin/news', { method: 'POST', body: JSON.stringify(data) }),
  updateNews: (id, data) => request(`/admin/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteNews: (id) => request(`/admin/news/${id}`, { method: 'DELETE' }),

  createMinistry: (data) => request('/admin/ministries', { method: 'POST', body: JSON.stringify(data) }),
  updateMinistry: (id, data) => request(`/admin/ministries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMinistry: (id) => request(`/admin/ministries/${id}`, { method: 'DELETE' }),

  createLeader: (data) => request('/admin/leadership', { method: 'POST', body: JSON.stringify(data) }),
  updateLeader: (id, data) => request(`/admin/leadership/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLeader: (id) => request(`/admin/leadership/${id}`, { method: 'DELETE' }),

  updateSettings: (section, data) => request(`/admin/settings/${section}`, { method: 'PUT', body: JSON.stringify(data) }),

  getPrayerRequests: () => request('/admin/prayer-requests'),
  handlePrayerRequest: (id, data) => request(`/admin/prayer-requests/${id}/handle`, { method: 'PATCH', body: JSON.stringify(data) }),
  deletePrayerRequest: (id) => request(`/admin/prayer-requests/${id}`, { method: 'DELETE' }),

  getMessages: () => request('/admin/messages'),
  markMessageRead: (id, read = true) => request(`/admin/messages/${id}/read`, { method: 'PATCH', body: JSON.stringify({ read }) }),
  deleteMessage: (id) => request(`/admin/messages/${id}`, { method: 'DELETE' }),

  getOrderOfService: () => request('/order-of-service'),
  notifyGiving: (data) => request('/giving/notify', { method: 'POST', body: JSON.stringify(data) }),

  getUsers: () => request('/admin/users'),
  createUser: (data) => request('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
};
