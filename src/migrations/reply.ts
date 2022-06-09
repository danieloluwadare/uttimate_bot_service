import ReplyService from "../components/v1/reply/service/reply";
import logger from "../config/winston";

export class ReplyMigrationService {
    static async up() {
        logger.info('ReplyMigrationService Initiating process');
        const replies = [
            {
                "minimumConfidence": 0.7131562352180481,
                "body":"Yes",
                "intent": "Means or need to contact "
            },
            {
                "minimumConfidence": 0.52000380754470825,
                "body":"Yes I want to speak with a human",
                "intent": "I want to speak with a human"
            },
            {
                "minimumConfidence": 0.09321193814277649,
                "body":"Yes Greeting",
                "intent": "Greeting"
            },
            {
                "minimumConfidence": 0.06822079464793205,
                "body":"Yes Login problems",
                "intent": "Login problems"
            },
            {
                "minimumConfidence": 0.03564663089811802,
                "body":"Yes Product interest or quote request",
                "intent": "Product interest or quote request"
            }
        ]
        await ReplyService.createAllIfNotExist(replies)
        logger.info('ReplyMigrationService Completed');

    }

    /**
     * "intents": [
     *     {
     *       "confidence": 0.5131562352180481,
     *       "name": "Means or need to contact "
     *     },
     *     {
     *       "confidence": 0.32000380754470825,
     *       "name": "I want to speak with a human"
     *     },
     *     {
     *       "confidence": 0.07321193814277649,
     *       "name": "Greeting"
     *     },
     *     {
     *       "confidence": 0.04822079464793205,
     *       "name": "Login problems"
     *     },
     *     {
     *       "confidence": 0.01564663089811802,
     *       "name": "Product interest or quote request"
     *     }
     *   ],
     */
}