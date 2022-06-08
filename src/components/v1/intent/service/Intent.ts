import {Intent} from "../model/Intent";
import axios from "axios";
import config from "../../../../config";
import {ConversationRequestDto} from "../../generic/conversationRequestDto";


export type Intents ={
    intents:Intent[]
    entities:any[]
}

export class IntentService {
    static async fetchIntents(requestDto : ConversationRequestDto) {

        // 👇️ const data: Intents
        const { data, status } = await axios.post<Intents>(
            config.ultimateAiUrl,
            {...requestDto},
            {
                headers: {
                    Authorization: config.ultimateAiAuthorization,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
            },
        );

        return data.intents[0];
    }
}