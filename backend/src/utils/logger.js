function formatMessage(level, message, meta) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  });
}

const logger = {
  info(message, meta = {}) {
    console.log(formatMessage('info', message, meta));
  },
  warn(message, meta = {}) {
    console.warn(formatMessage('warn', message, meta));
  },
  error(message, meta = {}) {
    console.error(formatMessage('error', message, meta));
  },
};

module.exports = { logger };
