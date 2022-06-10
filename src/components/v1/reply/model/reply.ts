import {model, Schema} from 'mongoose';

// An interface that describes the properties that a Reply Document has
export interface ReplyDoc {
    _id: string;
    intent: string;
    body: string;
    minimumConfidence: number;
}


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
