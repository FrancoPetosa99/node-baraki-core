class Exception {
    constructor(statusCode, message, details) {
        this.status = 'Error';
        this.statusCode = statusCode;
        this.message = message;
        this.details = details || 'No details provided';
        this.timestamp = new Date().toISOString();
    }
}

module.exports = Exception;