const authService = require('../services/authService');

class AuthController {

  async register(req, res) {
    try {
      const result = await authService.register(req.body);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      const status = error.statusCode || error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Registration failed',
        details: error.details || error.errors || undefined,
        timestamp: error.timestamp || undefined
      });
    }
  }

  async login(req, res) {
    try {
      const result = await authService.login(req.body);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      const status = error.statusCode || error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Login failed',
        details: error.details || error.errors || undefined,
        timestamp: error.timestamp || undefined
      });
    }
  }

  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided'
        });
      }

      const user = await authService.verifyToken(token);

      res.status(200).json({
        success: true,
        data: { user: authService.sanitizeUser(user) }
      });
    } catch (error) {
      const status = error.statusCode || error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Token verification failed',
        details: error.details || undefined,
        timestamp: error.timestamp || undefined
      });
    }
  }
}

module.exports = new AuthController();