const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        status: 'fail',
        message: 'Access denied. No token provided or invalid format.' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        status: 'fail',
        message: 'Access denied. Token is missing.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        status: 'fail',
        message: 'Token has expired. Please login again.' 
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        status: 'fail',
        message: 'Invalid token.' 
      });
    }
    
    // Generic error
    return res.status(500).json({ 
      status: 'error',
      message: 'Token verification failed.',
      error: err.message 
    });
  }
};