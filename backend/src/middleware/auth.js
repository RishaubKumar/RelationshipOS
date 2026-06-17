const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // get token from authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization token, access denied' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token found, authorization denied' });
    }

    // verify token using jwt secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is invalid or expired, authorization denied' });
  }
};

module.exports = auth;
