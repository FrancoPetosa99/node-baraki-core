const authService = require('../services/authService');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await authService.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    const status = error.status || 401;
    res.status(status).json({
      success: false,
      message: error.message || 'Authentication failed'
    });
  }
};

module.exports = authMiddleware;