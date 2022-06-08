import { boolean, date, object, SchemaOf, string } from 'yup';
import {ConversationRequestDto} from "../../generic/conversationRequestDto";

const ConversationSchema: SchemaOf<ConversationRequestDto> = object().shape({
  botId:string().required(),
  message: string().required()
});

export default ConversationSchema;
