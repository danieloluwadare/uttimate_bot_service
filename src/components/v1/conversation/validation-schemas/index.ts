import {object, SchemaOf, string} from 'yup';
import {ConversationRequestDto} from "../../types/conversationRequestDto";

const ConversationSchema: SchemaOf<ConversationRequestDto> = object().shape({
    botId: string().required(),
    message: string().required()
});

export default ConversationSchema;
