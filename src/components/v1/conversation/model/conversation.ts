import {model, Schema} from 'mongoose';
import {Intent, IntentSchema} from "../../intent/model/Intent";
import {ConversationRequestDto, ConversationRequestDtoSchema} from "../../types/conversationRequestDto";
import {ReplyDoc, ReplySchema} from "../../reply/model/reply";

// An interface that describes the properties that a Reply Document has
export interface ConversationDoc {
    request:ConversationRequestDto,
    intent: Intent;
    reply: ReplyDoc;
}


const ConversationSchema = new Schema<ConversationDoc>({
    request:{
        type:ConversationRequestDtoSchema
    },
    intent: {
        type: IntentSchema,
        default: null
    },
    reply: {
        type: ReplySchema,
        default: null,
    },
});


export const Conversation = model<ConversationDoc>('Conversation', ConversationSchema);
