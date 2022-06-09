import { Router } from 'express';
// import { isAuthenticated } from '../../../../middleware/auth';
import ConversationController from '../controller/index';
import {conversationValidator} from "../validations";
// import { todoValidator } from '../validators/todo';

export const todosRouter = Router();

todosRouter
    .route('/conversation')
    .post(conversationValidator,ConversationController.chat)
