import mongoose from 'mongoose';
import logger from './logger';
import config from 'config';

function connect() {
  const dbUri = config.get<string>('dbUri');

  return mongoose
    .connect(dbUri)
    .then(() => {
      logger.info('Database connected');
    })
    .catch(err => {
      logger.error('db error', err);
      process.exit(1);
    });
}

export default connect;
