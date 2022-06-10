import {Request, Response} from 'express';
import {catchAsync} from "../../../../helpers/catchAsyncError";
import ConversationService from "../service/conversation"
import {ConversationRequestDto} from "../../types/conversationRequestDto";
import {ReplyDoc} from "../../reply/model/reply";

const ConversationController = {

    chat: catchAsync(async (req: Request, res: Response) => {
        const data = req.body as ConversationRequestDto;
        const reply: ReplyDoc = await ConversationService.getReply(data)
        return res.status(201).json({
            status: 'Successful',
            message: reply.body,
        });
    })

};

export default ConversationController;