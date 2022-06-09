import {ConversationRequestDto} from "../../generic/conversationRequestDto";
import {IntentService} from "../../intent/service/Intent";
import Exception from "../../../../helpers/exception";
import ReplyService from "../../reply/service/reply";
import {Intent} from "../../intent/model/Intent";
import logger from "../../../../config/winston";
import ExceptionType from "../../generic/exceptionType";


class ConversationService {
    private static instance: ConversationService;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() { }

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): ConversationService {
        if (!ConversationService.instance) {
            ConversationService.instance = new ConversationService();
        }

        return ConversationService.instance;
    }

    async getReply(requestDto : ConversationRequestDto){
        const intent : Intent= await IntentService.fetchIntents(requestDto)
        logger.info(`fetched intent ${intent}`)
        if(!intent)
            throw new Exception(ExceptionType.INTENT_NOT_FOUND.toString(), 400,"AI Unable To Understand Your Input")

        logger.info(`Intent found ${intent} ==> ${intent.name} ==> ${intent.confidence}`)

        const replyResponse = await ReplyService.findByIntentAndConfidenceSore(intent.name, intent.confidence)

        logger.info(`replyResponse found ${replyResponse}`)

        if(!replyResponse)
            throw new Exception(ExceptionType.REPLY_NOT_FOUND.toString(), 400, "AI Unable To Understand Your Input")

        return replyResponse;

    }
}

export default ConversationService.getInstance()
