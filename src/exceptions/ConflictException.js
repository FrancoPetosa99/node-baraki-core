const Exception = require("./Exception");

class ConflictException extends Exception{
    constructor(detail) {
        super(409, 'resource already exist', detail);
    }
}

module.exports = ConflictException;