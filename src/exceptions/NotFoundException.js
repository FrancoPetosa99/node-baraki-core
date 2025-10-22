const Exception = require("./Exception");

class NotFoundException extends Exception{
    constructor(detail) {
        super(404, 'resource not found', detail);
    }
}

module.exports = NotFoundException;