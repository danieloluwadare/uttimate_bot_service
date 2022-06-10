/**
 * @returns {Class} The Error class
 */
class Exception extends Error {
    statusCode: number;

    status: string;

    isOperational: boolean;
    operationalMessage ?: string

    /**
     * @param {String} message the error message
     * @param {Number} statusCode the error code
     * @param operationalMessage
     * @returns {Class} An error class
     */
    constructor(message: string, statusCode: number, operationalMessage?: string) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'Failed' : 'Error';
        this.isOperational = true;
        this.operationalMessage = operationalMessage

        Error.captureStackTrace(this, this.constructor);
    }
}

export default Exception;
