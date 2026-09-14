const express = require('express');
const router = express.Router();
const { loadData, saveData } = require('../db');
const { authenticate, requireRoles } = require('../middleware/auth');

// Public: POST /api/contact
router.post('/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please provide your name, email, and message.' });
  }

  const db = loadData();
  const newMsg = {
    id: 'msg-' + Date.now(),
    name: name.trim(),
    email: email.trim(),
    phone: phone ? phone.trim() : '',
    subject: subject ? subject.trim() : 'General Inquiry',
    message: message.trim(),
    read: false,
    receivedAt: new Date().toISOString()
  };

  db.contactMessages = db.contactMessages || [];
  db.contactMessages.unshift(newMsg);
  saveData(db);

  res.status(201).json({
    message: 'Thank you for reaching out to New Heritage Baptist Church! Your message has been received. Our administration will contact you shortly.',
    success: true
  });
});

// Admin: GET /api/admin/messages
router.get('/admin/messages', authenticate, (req, res) => {
  const db = loadData();
  res.json(db.contactMessages || []);
});

// Admin: PATCH /api/admin/messages/:id/read
router.patch('/admin/messages/:id/read', authenticate, (req, res) => {
  const db = loadData();
  const item = (db.contactMessages || []).find(m => m.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Message not found.' });

  item.read = req.body.read !== undefined ? Boolean(req.body.read) : true;
  saveData(db);
  res.json({ message: 'Message status updated.', item });
});

// Admin: DELETE /api/admin/messages/:id
router.delete('/admin/messages/:id', authenticate, (req, res) => {
  const db = loadData();
  const index = (db.contactMessages || []).findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Message not found.' });

  db.contactMessages.splice(index, 1);
  saveData(db);
  res.json({ message: 'Message deleted successfully.' });
});

module.exports = router;
