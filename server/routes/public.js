const express = require('express');
const router = express.Router();
const { loadData, saveData } = require('../db');

// GET /api/site-settings
router.get('/site-settings', (req, res) => {
  const db = loadData();
  res.json(db.siteSettings);
});

// GET /api/homepage
router.get('/homepage', (req, res) => {
  const db = loadData();
  const upcomingEvents = (db.events || [])
    .filter(e => e.status === 'upcoming')
    .slice(0, 4);

  const featuredSermon = (db.sermons || []).find(s => s.featured) || db.sermons[0] || null;
  const previewGallery = (db.galleryImages || []).slice(0, 8);
  const featuredNews = (db.news || []).slice(0, 3);

  res.json({
    siteSettings: db.siteSettings,
    serviceTimes: db.siteSettings.serviceTimes,
    scripture: db.siteSettings.scripture,
    upcomingEvents,
    featuredSermon,
    previewGallery,
    featuredNews,
    ministries: (db.ministries || []).slice(0, 6)
  });
});

// GET /api/about
router.get('/about', (req, res) => {
  const db = loadData();
  res.json({
    about: db.siteSettings.about,
    leadership: db.leadership || []
  });
});

// GET /api/ministries
router.get('/ministries', (req, res) => {
  const db = loadData();
  res.json(db.ministries || []);
});

// GET /api/ministries/:slug
router.get('/ministries/:slug', (req, res) => {
  const db = loadData();
  const item = (db.ministries || []).find(m => m.slug === req.params.slug);
  if (!item) return res.status(404).json({ error: 'Ministry not found.' });
  res.json(item);
});

// GET /api/sermons
router.get('/sermons', (req, res) => {
  const db = loadData();
  let list = db.sermons || [];
  const { search, speaker, category, series } = req.query;

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.speaker.toLowerCase().includes(q) ||
      s.scripture.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  }
  if (speaker) {
    list = list.filter(s => s.speaker.toLowerCase() === speaker.toLowerCase());
  }
  if (category) {
    list = list.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }
  if (series) {
    list = list.filter(s => s.series.toLowerCase() === series.toLowerCase());
  }

  res.json(list);
});

// GET /api/events
router.get('/events', (req, res) => {
  const db = loadData();
  const { status } = req.query;
  let list = db.events || [];
  if (status) {
    list = list.filter(e => e.status === status);
  }
  res.json(list);
});

// GET /api/gallery
router.get('/gallery', (req, res) => {
  const db = loadData();
  let list = db.galleryImages || [];
  const { category } = req.query;
  if (category && category !== 'All') {
    list = list.filter(g => g.category.toLowerCase() === category.toLowerCase());
  }
  res.json({
    categories: ['All', ...(db.galleryCategories || [])],
    images: list
  });
});

// GET /api/gallery/categories
router.get('/gallery/categories', (req, res) => {
  const db = loadData();
  res.json(db.galleryCategories || []);
});

// GET /api/news
router.get('/news', (req, res) => {
  const db = loadData();
  res.json(db.news || []);
});

// GET /api/news/:slug
router.get('/news/:slug', (req, res) => {
  const db = loadData();
  const item = (db.news || []).find(n => n.slug === req.params.slug);
  if (!item) return res.status(404).json({ error: 'Announcement not found.' });
  res.json(item);
});

// GET /api/giving
router.get('/giving', (req, res) => {
  const db = loadData();
  res.json(db.siteSettings.giving);
});


// GET /api/order-of-service
router.get('/order-of-service', (req, res) => {
  const db = loadData();
  res.json(db.siteSettings.orderOfService || []);
});

// POST /api/giving/notify
router.post('/giving/notify', (req, res) => {
  const db = loadData();
  const name = req.body.name || 'Anonymous Giver';
  const email = req.body.email || '';
  const phone = req.body.phone || '';
  const amount = req.body.amount || 'Not specified';
  const purpose = req.body.purpose || 'Tithes / Offering';
  const bank = req.body.bank || 'Direct Transfer';
  const reference = req.body.reference || 'None';
  const date = new Date().toISOString().split('T')[0];

  db.contactMessages = db.contactMessages || [];
  db.contactMessages.unshift({
    id: 'msg-giv-' + Date.now(),
    name: '[Giving Notification] ' + name,
    email: email,
    phone: phone,
    subject: 'Transfer Notification: ' + purpose + ' (' + amount + ')',
    message: 'A bank transfer notification has been submitted by ' + name + ' (Phone: ' + phone + ', Email: ' + email + ').\nAmount: ' + amount + '\nPurpose: ' + purpose + '\nBank/Reference: ' + bank + ' - Ref: ' + reference + '\nDate: ' + date,
    date: date,
    read: false
  });

  saveData(db);
  res.status(201).json({
    success: true,
    message: 'Thank you! Your giving notification has been recorded for church financial stewardship.'
  });
});

module.exports = router;

