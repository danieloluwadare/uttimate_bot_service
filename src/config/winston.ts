import winston from 'winston';
import config from './index';

const options = {
  file: {
    level: 'http',
    dirname: config.opt,
    filename: 'task_management_logger.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '512m',
    maxFiles: 5,
    colorize: false,
    handleExceptions: true,
    handleRejections: true,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

export const stream = {
  write: (message: string): void => {
    logger.info(message);
  },
};

export default logger;
