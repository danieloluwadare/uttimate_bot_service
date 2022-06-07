import { Router } from 'express';
// import { isAuthenticated } from '../../../../middleware/auth';
import TodoController from '../controller/chat';
// import { todoValidator } from '../validators/todo';

export const todosRouter = Router();

todosRouter
    .route('/conversation')
    .get(TodoController.testAnyController)
//     .post(isAuthenticated, todoValidator, TodoController.createTodo);
//
// todosRouter
//     .route('/todos/:id')
//     .get(isAuthenticated, TodoController.getSingleTodo)
//     .patch(isAuthenticated, TodoController.updateTodo)
//     .delete(isAuthenticated, TodoController.deleteTodo);
