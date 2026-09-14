const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nhbc-osogbo-super-secure-key-2026';

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Please log in to proceed.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }
}

function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    // superadmin always has access to everything
    if (req.user.role === 'superadmin' || allowedRoles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ error: 'Access forbidden. You do not have permission for this action.' });
  };
}

module.exports = {
  generateToken,
  authenticate,
  requireRoles
};
