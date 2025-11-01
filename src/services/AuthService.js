const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

class AuthService {
  // Validation methods
  validateRegisterInput(data) {
    const errors = [];
    const { first_name, last_name, email, password } = data;

    if (!first_name || first_name.trim().length === 0) {
      errors.push('First name is required');
    }
    if (first_name && first_name.length > 20) {
      errors.push('First name must not exceed 20 characters');
    }

    if (last_name && last_name.length > 20) {
      errors.push('Last name must not exceed 20 characters');
    }

    if (!email || email.trim().length === 0) {
      errors.push('Email is required');
    }
    if (email && !this.isValidEmail(email)) {
      errors.push('Invalid email format');
    }

    if (!password || password.trim().length === 0) {
      errors.push('Password is required');
    }
    if (password && password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    if (password && password.length > 128) {
      errors.push('Password must not exceed 128 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateLoginInput(data) {
    const errors = [];
    const { email, password } = data;

    if (!email || email.trim().length === 0) {
      errors.push('Email is required');
    }
    if (email && !this.isValidEmail(email)) {
      errors.push('Invalid email format');
    }

    if (!password || password.trim().length === 0) {
      errors.push('Password is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Business logic methods
  async register(userData) {
    const { first_name, last_name, email, password } = userData;

    // Validate input
    const validation = this.validateRegisterInput(userData);
    if (!validation.isValid) {
      throw {
        status: 400,
        message: 'Validation failed',
        errors: validation.errors
      };
    }

      // Check if user already exists
      const existingUser = await userRepository.findByEmail(email.toLowerCase());
    if (existingUser) {
      throw {
        status: 409,
        message: 'User with this email already exists'
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await userRepository.create({
        first_name: first_name.trim(),
        last_name: last_name ? last_name.trim() : undefined,
        email: email.toLowerCase().trim(),
        password: hashedPassword
      });

    // Generate token
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token
    };
  }

  async login(credentials) {
    const { email, password } = credentials;

    // Validate input
    const validation = this.validateLoginInput(credentials);
    if (!validation.isValid) {
      throw {
        status: 400,
        message: 'Validation failed',
        errors: validation.errors
      };
    }

    // Find user
    const user = await userRepository.findByEmail(email.toLowerCase());
    if (!user) {
      throw {
        status: 401,
        message: 'Invalid email or password'
      };
    }

    // Check if password exists (for OAuth users)
    if (!user.password) {
      throw {
        status: 401,
        message: 'Please use social login for this account'
      };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw {
        status: 401,
        message: 'Invalid email or password'
      };
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token
    };
  }

  generateToken(user) {
    return jwt.sign(
      { 
        id: user._id.toString(),
        email: user.email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  }

  sanitizeUser(user) {
    return {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      created_at: user.createdAt,
      updated_at: user.updatedAt
    };
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await userRepository.findById(decoded.id);
      
      if (!user) {
        throw {
          status: 401,
          message: 'User not found'
        };
      }

      return user;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw {
          status: 401,
          message: 'Invalid token'
        };
      }
      if (error.name === 'TokenExpiredError') {
        throw {
          status: 401,
          message: 'Token expired'
        };
      }
      throw error;
    }
  }
}

module.exports = new AuthService();