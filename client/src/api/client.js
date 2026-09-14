const API_BASE = '/api';

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

async function request(endpoint, options = {}) {
  const headers = options.headers || {};
  const token = getToken();

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || 'A network error occurred. Please try again.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
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