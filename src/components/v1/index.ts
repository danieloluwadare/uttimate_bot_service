import {Router} from 'express';
import {todosRouter} from './conversation/routes/index';

export const v1router = Router();

v1router.use(todosRouter);
