import app from './app';
import config from './config';
import logger from './config/winston';
import ConnectMongoDB from './database/mongoose';
import {ReplyMigrationService} from "./migrations/reply";
import {response} from "express";

ConnectMongoDB().then(response =>{
  ReplyMigrationService.up().then(rms => logger.info("completed bootstrapping"))
});

app.listen(config.port, () => {
  logger.log({
    message: `Server started on port ${config.port}!`,
    level: 'info',
  });
});
