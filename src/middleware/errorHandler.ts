/* eslint-disable require-jsdoc */
import {NextFunction, Request, Response} from 'express';
import logger from '../config/winston';
import Exception from '../helpers/exception';


const formatError = (err: Exception, res: Response) => {
    // Operational, trusted error
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.operationalMessage || err.message,
        });
    }
    else if(err.statusCode >= 500){
        // Programming or other unknown error
        return res.status(500).json({
            status: 'error',
            message: 'Oops! Something went wrong',
        });

    }
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        // stack: err.stack,
    });

};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let error = { ...err };
    error.message = err.message;
    logger.info({ Error: error });

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    return formatError(err, res);
};
