import {Router} from 'express';
import {conversationRouter} from './v1/conversation/routes';

export const v1router = Router();

v1router.use(conversationRouter);
