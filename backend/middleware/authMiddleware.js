const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from cookie (or headers as fallback)
  let token = req.cookies && req.cookies.token;
  
  if (!token) {
    const authHeader = req.header('Authorization');
    token = req.header('x-auth-token');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined in environment variables');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
