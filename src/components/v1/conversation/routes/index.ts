import { Router } from 'express';
// import { isAuthenticated } from '../../../../middleware/auth';
import ConversationController from '../controller/index';
import {conversationValidator} from "../validations/Intent";
// import { todoValidator } from '../validators/todo';

export const todosRouter = Router();

todosRouter
    .route('/conversation')
    .get(ConversationController.testEndpoint)
    .post(conversationValidator,ConversationController.chat)

todosRouter
    .route('/conversation2')
    .get(conversationValidator,ConversationController.testEndpoint2)
