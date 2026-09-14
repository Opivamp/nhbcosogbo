const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { loadData, saveData } = require('../db');
const { authenticate, requireRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Require authentication for all admin routes
router.use(authenticate);

// GET /api/admin/stats
router.get('/stats', (req, res) => {
  const db = loadData();
  res.json({
    totalImages: (db.galleryImages || []).length,
    totalEvents: (db.events || []).length,
    totalSermons: (db.sermons || []).length,
    totalMinistries: (db.ministries || []).length,
    totalNews: (db.news || []).length,
    unhandledPrayers: (db.prayerRequests || []).filter(p => !p.handled).length,
    unreadMessages: (db.contactMessages || []).filter(m => !m.read).length
  });
});

// ---------------- GALLERY MANAGEMENT ---------------- //
// POST /api/admin/gallery/upload (Multipart upload single or multiple)
router.post('/gallery/upload', requireRoles('superadmin', 'contentadmin'), upload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No image files uploaded.' });
  }

  const { title, caption, description, category, event, date, featured } = req.body;
  const db = loadData();
  db.galleryImages = db.galleryImages || [];

  const createdItems = req.files.map((file, idx) => {
    const item = {
      id: 'gal-' + Date.now() + '-' + idx,
      title: title || path.basename(file.originalname, path.extname(file.originalname)),
      caption: caption || description || '',
      description: description || caption || '',
      category: category || 'Sunday Services',
      event: event || '',
      date: date || new Date().toISOString().split('T')[0],
      imageUrl: '/uploads/' + file.filename,
      url: '/uploads/' + file.filename,
      featured: featured === 'true' || featured === true,
      order: db.galleryImages.length + idx + 1
    };
    db.galleryImages.unshift(item);
    return item;
  });

  saveData(db);
  res.status(201).json({
    message: `Successfully uploaded ${createdItems.length} photograph(s)!`,
    uploaded: createdItems,
    items: createdItems
  });
});

// PUT /api/admin/gallery/:id
router.put('/gallery/:id', requireRoles('superadmin', 'contentadmin'), (req, res) => {
  const db = loadData();
  const item = (db.galleryImages || []).find(g => g.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Gallery image not found.' });

  const { title, caption, category, event, date, featured, order } = req.body;
  if (title !== undefined) item.title = title;
  if (caption !== undefined) item.caption = caption;
  if (category !== undefined) item.category = category;
  if (event !== undefined) item.event = event;
  if (date !== undefined) item.date = date;
  if (featured !== undefined) item.featured = Boolean(featured);
  if (order !== undefined) item.order = Number(order);

  saveData(db);
  res.json({ message: 'Gallery image updated successfully.', item });
});

// DELETE /api/admin/gallery/:id
router.delete('/gallery/:id', requireRoles('superadmin', 'contentadmin'), (req, res) => {
  const db = loadData();
  const index = (db.galleryImages || []).findIndex(g => g.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Gallery image not found.' });

  const [removed] = db.galleryImages.splice(index, 1);
  saveData(db);
  res.json({ message: 'Photo deleted successfully.', removed });
});

// POST /api/admin/gallery/categories
router.post('/gallery/categories', requireRoles('superadmin', 'contentadmin'), (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Category name is required.' });

  const db = loadData();
  db.galleryCategories = db.galleryCategories || [];
  if (!db.galleryCategories.includes(name.trim())) {
    db.galleryCategories.push(name.trim());
    saveData(db);
  }
  res.json(db.galleryCategories);
});

// ---------------- SERMONS MANAGEMENT ---------------- //
router.post('/sermons', requireRoles('superadmin', 'contentadmin'), (req, res) => {
  const db = loadData();
  const newSermon = {
    id: 'srm-' + Date.now(),
    ...req.body,
    featured: Boolean(req.body.featured)
  };
  db.sermons = db.sermons || [];
  db.sermons.unshift(newSermon);
  saveData(db);
  res.status(201).json(newSermon);
});

router.put('/sermons/:id', requireRoles('superadmin', 'contentadmin'), (req, res) => {
  const db = loadData();
  const index = (db.sermons || []).findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Sermon not found.' });

  db.sermons[index] = { ...db.sermons[index], ...req.body };
  saveData(db);
  res.json(db.sermons[index]);
});

router.delete('/sermons/:id', requireRoles('superadmin', 'contentadmin'), (req, res) => {
  const db = loadData();
  const index = (db.sermons || []).findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Sermon not found.' });

  db.sermons.splice(index, 1);
  saveData(db);
  res.json({ message: 'Sermon deleted successfully.' });
});

// ---------------- EVENTS MANAGEMENT ---------------- //
router.post('/events', requireRoles('superadmin', 'contentadmin'), (req, res) => {
  const db = loadData();
  const newEvent = {
    id: 'evt-' + Date.now(),
    ...req.body,
    featured: Boolean(req.body.featured),
    status: req.body.status || 'upcoming'
  };
  db.events = db.events || [];
  db.events.unshift(newEvent);
  saveData(db);
  res.status(201).json(newEvent);
});

router.put('/events/:id', requireRoles('superadmin', 'contentadmin'), (req, res) => {
  const db = loadData();
  const index = (db.events || []).findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Event not found.' });

  db.events[index] = { ...db.events[index], ...req.body };
  saveData(db);
  res.json(db.events[index]);
});

router.delete('/events/:id', requireRoles('superadmin', 'contentadmin'), (req, res) => {
  const db = loadData();
  const index = (db.events || []).findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Event not found.' });

  db.events.splice(index, 1);
  saveData(db);
  res.json({ message: 'Event deleted successfully.' });
});

// ---------------- NEWS MANAGEMENT ---------------- //
router.post('/news', requireRoles('superadmin', 'contentadmin'), (req, res) => {
  const db = loadData();
  const slug = (req.body.title || 'news')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

  const newPost = {
    id: 'news-' + Date.now(),
    slug,
    ...req.body,
    date: req.body.date || new Date().toISOString().split('T')[0]
  };
  db.news = db.news || [];
  db.news.unshift(newPost);
  saveData(db);
  res.status(201).json(newPost);
});

router.put('/news/:id', requireRoles('superadmin', 'contentadmin'), (req, res) => {
  const db = loadData();
  const index = (db.news || []).findIndex(n => n.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'News post not found.' });

  db.news[index] = { ...db.news[index], ...req.body };
  saveData(db);
  res.json(db.news[index]);
});

router.delete('/news/:id', requireRoles('superadmin', 'contentadmin'), (req, res) => {
  const db = loadData();
  const index = (db.news || []).findIndex(n => n.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'News post not found.' });

  db.news.splice(index, 1);
  saveData(db);
  res.json({ message: 'News post deleted successfully.' });
});

// ---------------- MINISTRIES MANAGEMENT ---------------- //
router.post('/ministries', requireRoles('superadmin', 'contentadmin'), (req, res) => {
  const db = loadData();
  const slug = (req.body.name || 'ministry')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const newMin = {
    id: 'min-' + Date.now(),
    slug,
    ...req.body
  };
  db.ministries = db.ministries || [];
  db.ministries.push(newMin);
  saveData(db);
  res.status(201).json(newMin);
});

router.put('/ministries/:id', requireRoles('superadmin', 'contentadmin'), (req, res) => {
  const db = loadData();
  const index = (db.ministries || []).findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Ministry not found.' });

  db.ministries[index] = { ...db.ministries[index], ...req.body };
  saveData(db);
  res.json(db.ministries[index]);
});

router.delete('/ministries/:id', requireRoles('superadmin', 'contentadmin'), (req, res) => {
  const db = loadData();
  const index = (db.ministries || []).findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Ministry not found.' });

  db.ministries.splice(index, 1);
  saveData(db);
  res.json({ message: 'Ministry deleted successfully.' });
});

// ---------------- LEADERSHIP MANAGEMENT ---------------- //
router.post('/leadership', requireRoles('superadmin', 'contentadmin'), (req, res) => {
  const db = loadData();
  const newLead = {
    id: 'lead-' + Date.now(),
    ...req.body,
    order: (db.leadership || []).length + 1
  };
  db.leadership = db.leadership || [];
  db.leadership.push(newLead);
  saveData(db);
  res.status(201).json(newLead);
});

router.put('/leadership/:id', requireRoles('superadmin', 'contentadmin'), (req, res) => {
  const db = loadData();
  const index = (db.leadership || []).findIndex(l => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Leader profile not found.' });

  db.leadership[index] = { ...db.leadership[index], ...req.body };
  saveData(db);
  res.json(db.leadership[index]);
});

router.delete('/leadership/:id', requireRoles('superadmin', 'contentadmin'), (req, res) => {
  const db = loadData();
  const index = (db.leadership || []).findIndex(l => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Leader profile not found.' });

  db.leadership.splice(index, 1);
  saveData(db);
  res.json({ message: 'Leader profile deleted successfully.' });
});

// ---------------- SITE SETTINGS (SUPER ADMIN ONLY) ---------------- //
router.put('/settings/:section', requireRoles('superadmin'), (req, res) => {
  const db = loadData();
  const { section } = req.params;

  if (section === 'general') {
    db.siteSettings = { ...db.siteSettings, ...req.body };
  } else if (db.siteSettings[section] !== undefined) {
    db.siteSettings[section] = req.body;
  } else {
    db.siteSettings[section] = req.body;
  }

  saveData(db);
  res.json({ message: `Settings for ${section} updated successfully.`, settings: db.siteSettings });
});


// ---------------- USER & STAFF MANAGEMENT (SUPER ADMIN ONLY) ---------------- //
router.get('/users', requireRoles('superadmin'), (req, res) => {
  const db = loadData();
  const safeUsers = (db.users || []).map(({ passwordHash, ...user }) => user);
  res.json(safeUsers);
});

router.post('/users', requireRoles('superadmin'), (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const db = loadData();
  db.users = db.users || [];
  if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'A staff member with this email already exists.' });
  }

  const bcrypt = require('bcryptjs');
  const passwordHash = bcrypt.hashSync(password, 10);
  const newUser = {
    id: 'usr-' + Date.now(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: role || 'contentadmin',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveData(db);

  const { passwordHash: _, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

router.delete('/users/:id', requireRoles('superadmin'), (req, res) => {
  const db = loadData();
  const index = (db.users || []).findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Staff user not found.' });

  if (db.users[index].role === 'superadmin' && db.users.filter(u => u.role === 'superadmin').length <= 1) {
    return res.status(400).json({ error: 'Cannot delete the only Super Administrator account.' });
  }

  db.users.splice(index, 1);
  saveData(db);
  res.json({ message: 'User account deleted successfully.' });
});

module.exports = router;

