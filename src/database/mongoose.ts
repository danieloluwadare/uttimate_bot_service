import mongoose from 'mongoose';
import config from '../config';
import logger from '../config/winston';

/**
 * @name connectDB
 * @return {void} Null
 */
const connectDB = async (): Promise<void> => {

    try {
        const mongoDbUrl = config.app_in_dockerized_state === 'true' ? config.database.docker : config.database.url
        logger.info(`mongoDbUrl ==>  ${mongoDbUrl}`)
        logger.info(`config.app_in_dockerized_state ==>${config.app_in_dockerized_state}`)
        await mongoose.connect(`${mongoDbUrl}`, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });
        logger.info('DB connection successful');
    } catch (error) {
        logger.error(`An error occured connecting to DB: ${error}`);
    }
};

export default connectDB;
