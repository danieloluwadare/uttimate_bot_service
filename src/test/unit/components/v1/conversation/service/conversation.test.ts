import {Reply} from "../../../../../../components/v1/reply/model/reply";
import ReplyService from "../../../../../../components/v1/reply/service/reply";
import ConversationService from "../../../../../../components/v1/conversation/service/conversation"
import {IntentService} from "../../../../../../components/v1/intent/service/Intent";
import ExceptionType from "../../../../../../components/v1/generic/exceptionType";
describe('Unit Conversation Service', () => {
    it('expect intent exception if no intent can be found', () => {
        IntentService.fetchIntents = jest.fn().mockReturnValue(undefined)

        expect(async () => { await ConversationService.getReply({botId:'123',message:'hello'}) })
            .rejects.toThrow(ExceptionType.INTENT_NOT_FOUND.toString(),);
    });

    it('expect reply exception if no reply can be found', () => {
        IntentService.fetchIntents = jest.fn().mockReturnValue(
            {name: 'string',
                confidence: 0.98,
            })
        ReplyService.findByIntentAndConfidenceSore = jest.fn().mockReturnValue(undefined)

        expect(async () => { await ConversationService.getReply({botId:'123',message:'hello'}) })
            .rejects.toThrow(ExceptionType.REPLY_NOT_FOUND.toString(),);
    });
});