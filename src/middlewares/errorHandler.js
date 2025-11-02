const InternalServerExcepcion = require('../exceptions/InternalServerExcepcion');

function errorHandler(err, req, res, next) { 

  if (err && err.statusCode && typeof err.statusCode === 'number') {
    const { statusCode, message, details, timestamp, status } = err;
    return res.status(statusCode).json({ status: status || 'Error', statusCode, message, details, timestamp, path: req.originalUrl });
  }

  const wrapped = new InternalServerExcepcion(err && err.message ? err.message : 'Internal server error');

  return res.status(wrapped.statusCode).json({ status: wrapped.status, statusCode: wrapped.statusCode, message: wrapped.message, details: wrapped.details, timestamp: wrapped.timestamp, path: req.originalUrl });
}

module.exports = errorHandler;
