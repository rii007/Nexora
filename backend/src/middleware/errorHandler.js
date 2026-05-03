const { logger } = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error('Request failed', {
    path: req.originalUrl,
    method: req.method,
    message: err.message,
  });

  const status = err.status || 500;
  res.status(status).json({
    message: err.expose ? err.message : 'Internal server error',
  });
}

module.exports = { errorHandler };
