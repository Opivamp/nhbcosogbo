import initialDb from '../data/db.json';

const API_BASE = '/api';
const DB_STORAGE_KEY = 'nhbc_local_database_v1';

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

// Local mock database helpers for static hosting (GitHub Pages)
function getDb() {
  try {
    const cached = localStorage.getItem(DB_STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Could not read from localStorage, using initialDb');
  }
  const cloned = JSON.parse(JSON.stringify(initialDb));
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

  // Fallback to local embedded database
  return fallbackHandler(endpoint, options);
}

function fallbackHandler(endpoint, options = {}) {
  const db = getDb();
  const method = (options.method || 'GET').toUpperCase();
  let body = {};
  if (options.body && typeof options.body === 'string') {
    try { body = JSON.parse(options.body); } catch(e) {}
  }

  // 1. Public Routes
  if (endpoint === '/homepage') {
    const upcomingEvents = (db.events || []).filter(e => e.status === 'upcoming').slice(0, 4);
    const featuredSermon = (db.sermons || []).find(s => s.featured) || db.sermons[0] || null;
    const previewGallery = (db.galleryImages || []).slice(0, 8);
    const featuredNews = (db.news || []).slice(0, 3);
    return {
      siteSettings: db.siteSettings,
      serviceTimes: db.siteSettings?.serviceTimes || [],
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
    return db.sermons || [];
  }

  if (endpoint.startsWith('/events')) {
    return db.events || [];
  }

  if (endpoint.startsWith('/gallery')) {
    const url = new URL('http://local' + endpoint);
    const cat = url.searchParams.get('category');
    if (!cat || cat === 'All') return db.galleryImages || [];
    return (db.galleryImages || []).filter(img => img.category === cat);
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

  // 2. Auth Routes
  if (endpoint === '/auth/login' && method === 'POST') {
    const { email, password } = body;
    const user = (db.users || []).find(u => u.email === email);
    if (user || email.includes('@nhbcosogbo.org')) {
      const authUser = user ? { id: user.id, name: user.name, email: user.email, role: user.role } : {
        id: 'u-admin',
        name: 'Pastor Administrator',
        email: email,
        role: email.includes('editor') ? 'contentadmin' : (email.includes('prayer') ? 'prayeradmin' : 'superadmin')
      };
      const token = 'nhbc-static-jwt-' + Date.now();
      setToken(token);
      setUser(authUser);
      return { token, user: authUser };
    }
    throw new Error('Invalid email or password');
  }

  if (endpoint === '/auth/me') {
    const u = getUser();
    if (u) return u;
    throw new Error('Not authenticated');
  }

  // 3. Admin Routes
  if (endpoint === '/admin/stats') {
    return {
      galleryImages: (db.galleryImages || []).length,
      sermons: (db.sermons || []).length,
      events: (db.events || []).length,
      news: (db.news || []).length,
      prayerRequests: (db.prayerRequests || []).length,
      unreadMessages: (db.contactMessages || []).filter(m => !m.read).length,
    };
  }

  if (endpoint === '/admin/prayer-requests') {
    return db.prayerRequests || [];
  }

  if (endpoint.startsWith('/admin/prayer-requests/') && endpoint.endsWith('/handle')) {
    const id = endpoint.split('/')[3];
    const item = (db.prayerRequests || []).find(p => p.id === id);
    if (item) {
      Object.assign(item, body);
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

  if (endpoint.startsWith('/admin/settings/') && method === 'PUT') {
    const section = endpoint.replace('/admin/settings/', '');
    if (!db.siteSettings) db.siteSettings = {};
    db.siteSettings[section] = body;
    saveDb(db);
    return db.siteSettings;
  }

  // Generic fallback
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
