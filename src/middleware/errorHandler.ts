/* eslint-disable require-jsdoc */
import { NextFunction, Request, Response } from 'express';
import config from '../config';
import logger from '../config/winston';
import Exception from '../helpers/exception';
import MyException from "../helpers/myexception";

const handleCastErrorDB = (err: any) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new Exception(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
    const keyVal = Object.keys(err.keyValue)[0];
    const message = `${keyVal} already exists. Please, use a different ${keyVal}`;
    return new Exception(message, 400);
};

const handleValidationErrorDB = (err: any) => {
    const message = Object.values(err.errors).map((value: any) => value.message);
    return new Exception(message[0], 400);
};

const sendErrorDev = (err: Exception, res: Response) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        // stack: err.stack,
    });
};

const sendErrorProd = (err: Exception, res: Response) => {
    // Operational, trusted error
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    // Programming or other unknown error
    return res.status(500).json({
        status: 'error',
        message: 'Oops! Something went wrong',
    });
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {


    let error = { ...err };
    error.message = err.message;
    logger.info({ Error: error });

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development')
        return sendErrorDev(err, res);

    if (process.env.NODE_ENV === 'production') {
        if (err.name === 'CastError')
            error = handleCastErrorDB(error);
        if (err.code === 11000)
            error = handleDuplicateFieldsDB(error);
        if (err.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        sendErrorProd(error, res);
    }

    logger.error(`None ooooo type of 2: ${err}`);

    return sendErrorDev(err, res);
};
