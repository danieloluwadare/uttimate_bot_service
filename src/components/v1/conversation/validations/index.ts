import {NextFunction as Next, Request, Response} from 'express';
import Exception from '../../../../helpers/exception';
import ConversationSchema from "../validation-schemas";

/**
 * Validates the registration request
 *
 * @param {Object} req
 *
 * @param {Object} res
 *
 * @param {Function} next
 *
 * @return {Object}
 */
export const conversationValidator = async (req: Request, res: Response, next: Next): Promise<void> => {
    const { message, botId } = req.body;

    try {
        await ConversationSchema.validate({
            message,
            botId
        });
        return next();
    } catch (error:any) {
        next(new Exception(error.message, 422));
    }
};
