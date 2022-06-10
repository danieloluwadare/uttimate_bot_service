import {Router} from 'express';
import ConversationController from '../controller/index';
import {conversationValidator} from "../validations";

export const conversationRouter = Router();

conversationRouter
    .route('/conversation')
    .post(conversationValidator, ConversationController.chat)
