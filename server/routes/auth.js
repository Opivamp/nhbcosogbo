const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { loadData } = require('../db');
const { generateToken, authenticate } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide both email and password.' });
  }

  const db = loadData();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email address or password. Please verify your credentials.' });
  }

  const token = generateToken(user);
  res.json({
    message: 'Login successful.',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  const db = loadData();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User account not found.' });
  }
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

module.exports = router;
