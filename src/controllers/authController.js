const authService = require('../services/authService');

class AuthController {

  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }

  async verifyToken(req, res, next) {
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
      return next(error);
    }
  }
}

module.exports = new AuthController();