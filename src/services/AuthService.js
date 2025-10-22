const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const BadRequestException = require('../exceptions/BadRequestException');
const InternalServerExcepcion = require('../exceptions/InternalServerExcepcion');

class AuthService {
    async registerUser({ email, password }) {
        if (!email || !password) throw new BadRequestException('Email and password required');

        const existing = await User.findOne({ email });
        if (existing) throw new BadRequestException('User already exists');

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const user = await User.create({ email, password: hashed });
        return user;
    }

    async generateAuthToken(email, password) {
        if (!email || !password) throw new BadRequestException('Email and password required');

        const user = await User.findOne({ email });
        if (!user) throw new BadRequestException('Invalid credentials');

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new BadRequestException('Invalid credentials');

        if (!process.env.JWT_SECRET) 
            throw new InternalServerExcepcion('JWT secret key missing in current enviorment');

        const payload = { sub: user._id.toString(), email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        return token;
    }
}

module.exports = new AuthService();