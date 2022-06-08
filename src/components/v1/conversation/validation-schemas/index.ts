import { boolean, date, object, SchemaOf, string } from 'yup';
import {IntentDto} from "../../intent/model/Intent";

const IntentSchema: SchemaOf<IntentDto> = object().shape({
  botId:string().required(),
  message: string().required()
});

export default IntentSchema;
