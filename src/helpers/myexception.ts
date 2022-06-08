/**
 * @returns {Class} The Error class
 */
class MyException extends Error {
    statusCode: number;

    status: string;

    isOperational: boolean;

    /**
     * @param {String} message the error message
     * @param {Number} statusCode the error code
     * @returns {Class} An error class
     */
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'Failed' : 'Error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default MyException;
