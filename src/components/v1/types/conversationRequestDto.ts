import {Schema} from "mongoose";

export interface ConversationRequestDto {
    botId: string
    message: string
}

export const ConversationRequestDtoSchema = new Schema<ConversationRequestDto>({
    botId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
});

