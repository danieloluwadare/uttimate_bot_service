import {Intent, IntentDto} from "../model/Intent";
import axios from "axios";
import config from "../../../../config";


export type Intents ={
    intents:Intent[]
    entities:any[]
}

export class IntentService {
    static async fetchIntents(intentDto : IntentDto) {

        // 👇️ const data: Intents
        const { data, status } = await axios.post<Intents>(
            config.ultimateAiUrl,
            {...intentDto},
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