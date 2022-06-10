import app from './app';
import config from './config';
import logger from './config/winston';
import ConnectMongoDB from './database/mongoose';
import {ReplySeederService} from "./seeder/reply";

ConnectMongoDB().then(response => {
    ReplySeederService.up().then(rms => logger.info("ReplySeederService completed"))
});

app.listen(config.port, () => {
    logger.log({
        message: `Server started on port ${config.port}!`,
        level: 'info',
    });
});
