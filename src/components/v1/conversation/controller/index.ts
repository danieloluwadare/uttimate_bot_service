import { Request, Response } from 'express';
import Exception from "../../../../helpers/exception";
import {catchAsync} from "../../../../helpers/catchAsyncError";
import ConversationService from "../service/index"
import {ConversationRequestDto} from "../../generic/conversationRequestDto";
import MyException from "../../../../helpers/myexception";

const ConversationController = {
    testEndpoint : catchAsync(async (req : Request, res: Response) => {
        throw new Exception("Ok", 404)
    }),
    testEndpoint2 : catchAsync(async (req : Request, res: Response) => {
        throw new MyException("Ok", 404)
    }),

    chat : catchAsync(async (req : Request, res: Response) => {
        const data = req.body as ConversationRequestDto;
        const reply = await ConversationService.getReply(data)
        return res.status(201).json({
            status: 'Successful',
            data: reply,
        });
    })

};

export default ConversationController;