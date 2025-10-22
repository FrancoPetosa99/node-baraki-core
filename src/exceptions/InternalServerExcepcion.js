const Exception = require("./Exception");

class InternalServerExcepcion extends Exception{
    constructor(detail) {
        super(500, 'internal server error', detail);
    }
}

module.exports = InternalServerExcepcion;