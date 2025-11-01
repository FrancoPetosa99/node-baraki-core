// controllers/AuthController.js
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
      const status = error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Registration failed',
        errors: error.errors || undefined
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
      const status = error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Login failed',
        errors: error.errors || undefined
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
      const status = error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Token verification failed'
      });
    }
  }
}

module.exports = new AuthController();