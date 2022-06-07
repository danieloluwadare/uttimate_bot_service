import { Request, Response } from 'express';
import Exception from "../../../../helpers/exception";
import {catchAsync} from "../../../../helpers/catchAsyncError";

const TodoController = {
    testAnyController : catchAsync(async (req : Request, res: Response) => {
        throw new Exception("Ok", 404)
    })
    // createTodo: catchAsync(async (req: Request, res: Response) => {
    //     const todo = await Todo.create(req.body);
    //
    //     return res.status(201).json({
    //         status: 'Successful',
    //         data: todo,
    //     });
    // }),
    //
    // getAllTodos: catchAsync(async (req: Request, res: Response) => {
    //     const todo = await Todo.find({});
    //
    //     return res.status(200).json({
    //         status: 'Successful',
    //         data: todo,
    //     });
    // }),
    //
    // getSingleTodo: catchAsync(async (req: Request, res: Response) => {
    //     const todo = await Todo.findById(req.params.id);
    //
    //     if (!todo) throw new Exception('No Todo found with that ID', 404);
    //
    //     return res.status(200).json({
    //         status: 'Successful',
    //         data: todo,
    //     });
    // }),
    //
    // updateTodo: catchAsync(async (req: Request, res: Response) => {
    //     const { id } = req.params;
    //     const data = req.body;
    //
    //     const todo = await Todo.findByIdAndUpdate(id, data, {
    //         new: true,
    //         runValidators: true,
    //     });
    //
    //     if (!todo) throw new Exception('No Todo found with that ID', 404);
    //
    //     return res.status(200).json({
    //         status: 'Successful',
    //         data: todo,
    //     });
    // }),
    //
    // deleteTodo: catchAsync(async (req: Request, res: Response) => {
    //     const { id } = req.params;
    //
    //     const todo = await Todo.findByIdAndDelete(id);
    //
    //     if (!todo) throw new Exception('No Todo found with that ID', 404);
    //
    //     return res.status(204).json({
    //         status: 'Successful',
    //         data: todo,
    //     });
    // }),
};

export default TodoController;