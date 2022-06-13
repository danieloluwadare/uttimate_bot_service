import {Schema} from "mongoose";

export interface Intent {
    name: string;
    confidence: number;
}


export const IntentSchema = new Schema<Intent>({
    name: {
        type: String,
        required: true,
    },
    confidence: {
        type: String,
        required: true,
    }
});
