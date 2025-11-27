const jwt = require('jsonwebtoken');
// middleware/auth.js

const auth = async (req, res, next) => {
  try {
    let token;

    // 🔐 1) Prefer token from http-only cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else {
      // 2) Fallback to Authorization header: Bearer <token>
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // We put user id on req.user (same id you put in token)
    req.user = { id: decoded.id };

    next();
  } catch (err) {
    console.error('Auth Error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = auth;
