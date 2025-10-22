const Exception = require("./Exception");

class ForbiddenException extends Exception{
    constructor(message, detail) {
        super(403, message, detail);
    }
}

module.exports = ForbiddenException;