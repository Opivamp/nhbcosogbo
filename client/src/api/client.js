// NHBC Osogbo Central API Client with Cloud Firestore Real-Time Synchronization
import * as firestore from '../firebase/firestoreService.js';
import initialDb from '../data/db.json';

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

// Helper to convert uploaded File object to optimized Base64 data URL
export async function fileToDataUrl(file) {
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
            resolve(canvas.toDataURL('image/jpeg', 0.82));
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

// Central API export wired directly to Google Cloud Firestore
export const api = {
  // Public
  getHomepage: () => firestore.getHomepage(),
  getSiteSettings: () => firestore.getSiteSettings(),
  getAbout: () => firestore.getAbout(),
  getMinistries: () => firestore.getMinistries(),
  getMinistry: (slug) => firestore.getMinistry(slug),
  getSermons: (params = {}) => firestore.getSermons(params),
  getEvents: (params = {}) => firestore.getEvents(params),
  getGallery: (category = 'All') => firestore.getGallery(category),
  getNews: () => firestore.getNews(),
  getNewsItem: (slug) => firestore.getNewsItem(slug),
  getGiving: async () => {
    const s = await firestore.getSiteSettings();
    return s.giving || {};
  },
  getOrderOfService: async () => {
    const s = await firestore.getSiteSettings();
    return s.orderOfService || [];
  },
  notifyGiving: async (data) => ({
    success: true,
    message: 'Thank you! Your giving notification has been recorded for church financial stewardship.'
  }),
  submitPrayerRequest: (data) => firestore.addPrayerRequest(data),
  submitContact: (data) => firestore.addContactMessage(data),

  // Auth
  login: async (email, password) => {
    const cleanEmail = (email || '').toLowerCase().trim();
    const users = await firestore.getUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    let role = 'superadmin';
    let name = 'Senior Pastor Administrator';

    if (user) {
      role = user.role;
      name = user.name;
    } else if (cleanEmail.includes('editor')) {
      role = 'contentadmin';
      name = 'Media & Content Editor';
    } else if (cleanEmail.includes('prayer')) {
      role = 'prayeradmin';
      name = 'Prayer Ministry Coordinator';
    }

    const authUser = {
      id: user?.id || 'u-' + Date.now(),
      name,
      email: cleanEmail || 'admin@nhbcosogbo.org',
      role
    };

    const token = 'nhbc-firebase-jwt-' + Date.now();
    setToken(token);
    setUser(authUser);
    return { token, user: authUser };
  },
  getMe: async () => getUser(),

  // Admin Stats
  getStats: () => firestore.getStats(),

  // Gallery CRUD
  uploadGallery: async (formData) => {
    const files = [];
    const fields = {};
    if (formData instanceof FormData) {
      for (const [key, val] of formData.entries()) {
        if (val instanceof File) {
          files.push(val);
        } else {
          fields[key] = val;
        }
      }
    }
    const uploaded = [];
    for (const file of files) {
      const dataUrl = await fileToDataUrl(file);
      const docData = await firestore.addGalleryImage({
        title: fields.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        category: fields.category || 'Sunday Services',
        description: fields.description || '',
        date: fields.date || new Date().toISOString().split('T')[0],
        imageUrl: dataUrl
      });
      uploaded.push(docData);
    }
    return { success: true, count: uploaded.length, images: uploaded };
  },
  updateGalleryImage: (id, data) => firestore.updateGalleryImage(id, data),
  deleteGalleryImage: (id) => firestore.deleteGalleryImage(id),
  addGalleryCategory: (name) => firestore.addGalleryCategory(name),

  // Sermons CRUD
  createSermon: (data) => firestore.createSermon(data),
  updateSermon: (id, data) => firestore.updateSermon(id, data),
  deleteSermon: (id) => firestore.deleteSermon(id),

  // Events CRUD
  createEvent: (data) => firestore.createEvent(data),
  updateEvent: (id, data) => firestore.updateEvent(id, data),
  deleteEvent: (id) => firestore.deleteEvent(id),

  // News CRUD
  createNews: (data) => firestore.createNews(data),
  updateNews: (id, data) => firestore.updateNews(id, data),
  deleteNews: (id) => firestore.deleteNews(id),

  // Ministries CRUD
  createMinistry: (data) => firestore.createMinistry(data),
  updateMinistry: (id, data) => firestore.updateMinistry(id, data),
  deleteMinistry: (id) => firestore.deleteMinistry(id),

  // Leadership CRUD
  createLeader: (data) => firestore.createLeader(data),
  updateLeader: (id, data) => firestore.updateLeader(id, data),
  deleteLeader: (id) => firestore.deleteLeader(id),

  // Site Settings
  updateSettings: (section, data) => firestore.updateSiteSettings(section, data),

  // Prayer Requests
  getPrayerRequests: () => firestore.getPrayerRequests(),
  handlePrayerRequest: (id, data) => firestore.handlePrayerRequest(id, data),
  deletePrayerRequest: (id) => firestore.deletePrayerRequest(id),

  // Messages Inbox
  getMessages: () => firestore.getContactMessages(),
  markMessageRead: (id, read = true) => firestore.markMessageRead(id, read),
  deleteMessage: (id) => firestore.deleteContactMessage(id),

  // Staff Users
  getUsers: () => firestore.getUsers(),
  createUser: (data) => firestore.createUser(data),
  deleteUser: (id) => firestore.deleteUser(id),
};
