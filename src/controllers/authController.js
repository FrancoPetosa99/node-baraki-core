const BadRequestException = require('../exceptions/BadRequestException');
const InternalServerExcepcion = require('../exceptions/InternalServerExcepcion');
const authService = require('../services/AuthService'); 

class AuthController {    
    login = async (request, response) => {
        const { email, password } = request.body;
        if (!email || !password) 
            throw new BadRequestException('Email and password required');
        
        if (!process.env.JWT_SECRET) 
            throw new InternalServerExcepcion('JWT secret key missing in current enviorment');

        const authToken = await authService.generateAuthToken(email, password);

        return response
        .status(200)
        .json({ 
            statusCode: 200,
            message: 'User successfully login',
            authToken: authToken, 
        });
    };

    register = async (request, response) => {
        const { email, password } = request.body;
        if (!email || !password) 
            throw new BadRequestException('Email and password required');

        const data = { email, password };
        await authService.registerUser(data);
        
        return response
        .status(201)
        .json({ 
            status: 'Success',
            message: 'User successfully created'
        });
    };
}

module.exports = new AuthController();