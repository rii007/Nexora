const { app } = require('./src/app');
const { connectDatabase } = require('./src/config/db');
const { env } = require('./src/config/env');
const { logger } = require('./src/utils/logger');

async function bootstrap() {
  try {
    await connectDatabase();

    app.listen(env.port, () => {
      logger.info('API server started', {
        port: env.port,
        environment: env.nodeEnv,
      });
    });
  } catch (error) {
    logger.error('Failed to start server', { message: error.message });
    process.exit(1);
  }
}

bootstrap();
