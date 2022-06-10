import ReplyService from "../components/v1/reply/service/reply";
import logger from "../config/winston";

export class ReplySeederService {
    static async up() {
        logger.info('ReplySeederService Initiating process');
        const replies = [
            {
                "minimumConfidence": 0.7131562352180481,
                "body": "Yes",
                "intent": "Means or need to contact "
            },
            {
                "minimumConfidence": 0.52000380754470825,
                "body": "Yes I want to speak with a human",
                "intent": "I want to speak with a human"
            },
            {
                "minimumConfidence": 0.09321193814277649,
                "body": "Yes Greeting",
                "intent": "Greeting"
            },
            {
                "minimumConfidence": 0.06822079464793205,
                "body": "Yes Login problems",
                "intent": "Login problems"
            },
            {
                "minimumConfidence": 0.03564663089811802,
                "body": "Yes Product interest or quote request",
                "intent": "Product interest or quote request"
            },
            {
                "minimumConfidence": 0.4404347777366638,
                "body": "I am fine thank you",
                "intent": "How are you doing?"
            }
        ]
        await ReplyService.createAllIfNotExist(replies)
        logger.info('ReplySeederService Completed');

    }

}