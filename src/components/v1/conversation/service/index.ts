import {ConversationRequestDto} from "../../generic/conversationRequestDto";
import {IntentService} from "../../intent/service/Intent";
import Exception from "../../../../helpers/exception";
import ReplyService from "../../reply/service/reply";
import {Intent} from "../../intent/model/Intent";


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
        if(!intent)
            throw new Exception("Intent_not_found", 404)

        const replyResponse = await ReplyService.findBy(intent.name, intent.confidence)

        if(!replyResponse)
            throw new Exception("reply_not_found", 404)

        return replyResponse;

    }
}

export default ConversationService.getInstance()
