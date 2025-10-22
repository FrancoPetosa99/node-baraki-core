const Exception = require("./Exception");

class BadRequestException extends Exception{
    constructor(message, detail) {
        super(400, message, detail);
    }
}

module.exports = BadRequestException;