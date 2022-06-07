import { model, Schema } from 'mongoose';
import config from '../../../../config';

// An interface that describes the properties that a Reply Document has
export interface ReplyDoc {
  _id: string;
  intent: string;
  body: string;
  minimumConfidence: number;
}

//The reply that is related to this intent is only given,
// if the confidence is above a certain threshold, which was previously configured for that reply

const ReplySchema = new Schema<ReplyDoc>({
  intent: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  minimumConfidence: {
    type: Number,
    required: true,
  },
});



export const Reply = model<ReplyDoc>('Reply', ReplySchema);
