const express = require('express');
const router = express.Router();
const { loadData, saveData } = require('../db');
const { authenticate, requireRoles } = require('../middleware/auth');

// Public: POST /api/prayer-requests
router.post('/prayer-requests', (req, res) => {
  const { name, contactInfo, prayerCategory, request, contactPreference, isAnonymous } = req.body;

  if (!request || request.trim().length < 5) {
    return res.status(400).json({ error: 'Please enter your prayer request (minimum 5 characters).' });
  }

  const db = loadData();
  const newEntry = {
    id: 'pry-' + Date.now(),
    name: isAnonymous ? 'Anonymous' : (name && name.trim() ? name.trim() : 'Anonymous'),
    contactInfo: isAnonymous ? 'Confidential' : (contactInfo || 'Not provided'),
    prayerCategory: prayerCategory || 'General Prayer',
    request: request.trim(),
    contactPreference: contactPreference || 'Prayer only',
    isAnonymous: Boolean(isAnonymous),
    handled: false,
    pastoralNotes: '',
    submittedAt: new Date().toISOString()
  };

  db.prayerRequests = db.prayerRequests || [];
  db.prayerRequests.unshift(newEntry);
  saveData(db);

  res.status(201).json({
    message: 'Your prayer request has been received with strict confidentiality. Our pastoral and intercessory prayer team will uphold you before the Lord in prayer.',
    success: true
  });
});

// Admin: GET /api/admin/prayer-requests (Staff/Prayer & Super Admin only)
router.get('/admin/prayer-requests', authenticate, requireRoles('superadmin', 'prayeradmin'), (req, res) => {
  const db = loadData();
  res.json(db.prayerRequests || []);
});

// Admin: PATCH /api/admin/prayer-requests/:id/handle
router.patch('/admin/prayer-requests/:id/handle', authenticate, requireRoles('superadmin', 'prayeradmin'), (req, res) => {
  const db = loadData();
  const item = (db.prayerRequests || []).find(p => p.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Prayer request not found.' });

  item.handled = req.body.handled !== undefined ? Boolean(req.body.handled) : true;
  if (req.body.pastoralNotes !== undefined) {
    item.pastoralNotes = req.body.pastoralNotes;
  }
  saveData(db);
  res.json({ message: 'Prayer request status updated.', item });
});

// Admin: DELETE /api/admin/prayer-requests/:id
router.delete('/admin/prayer-requests/:id', authenticate, requireRoles('superadmin', 'prayeradmin'), (req, res) => {
  const db = loadData();
  const index = (db.prayerRequests || []).findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Prayer request not found.' });

  db.prayerRequests.splice(index, 1);
  saveData(db);
  res.json({ message: 'Prayer request deleted successfully.' });
});

module.exports = router;
