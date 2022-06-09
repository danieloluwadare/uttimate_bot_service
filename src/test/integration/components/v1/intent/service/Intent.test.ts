import ReplyService from "../../../../../../components/v1/reply/service/reply";
import request from 'supertest';
import app from '../../../../../../app';
import {Reply} from "../../../../../../components/v1/reply/model/reply";
import {IntentService} from "../../../../../../components/v1/intent/service/Intent";

describe('Intent Service', () => {
    it('should fetch an intent by botId and message', async () => {
        // const response = await IntentService.fetchIntents({botId:"5552768287",message:"message"})
        // expect(response.name).toBeDefined()
    });


});