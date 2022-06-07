import app from './app';
import config from './config';
import logger from './config/winston';
import ConnectMongoDB from './database/mongoose';

ConnectMongoDB();

app.listen(config.port, () => {
  logger.log({
    message: `Server started on port ${config.port}!`,
    level: 'info',
  });
});
