import request from 'supertest';
import app from '../../../../../../app';
import {ReplySeederService} from "../../../../../../seeder/reply";

describe('POST v1/conversation', () => {
    const conversationUrl = `/v1/conversation`

    const postRequest = {
        message: "hello",
        botId: "5f74865056d7bb000fcd39ff"
    }

    it('should return 422 when message property is missing ', async () => {
        const response = await request(app)
            .post(conversationUrl)
            .send({...postRequest, message: ''})
            .expect(422);

        expect(response.body.status).toBe('Failed');
        expect(response.body.message).toBe('message is a required field')
    });

    it('should return 422 when botId property is missing ', async () => {
        const response = await request(app)
            .post(conversationUrl)
            .send({...postRequest, botId: ''})
            .expect(422);

        expect(response.body.status).toBe('Failed');
        expect(response.body.message).toBe('botId is a required field')
    });

    it('should return 400 when no reply is found ', async () => {
        await ReplySeederService.up()

        const response = await request(app)
            .post(conversationUrl)
            .send({...postRequest, message: 'football is awesome'})
            .expect(400);

        expect(response.body.status).toBe('Failed');
        expect(response.body.message).toBe('AI Unable To Understand Your Input')
    });

    it('should return 200 when a reply is found ', async () => {
        await ReplySeederService.up()

        const response = await request(app)
            .post(conversationUrl)
            .send({...postRequest})
            .expect(201);

        expect(response.body.status).toBe('Successful');
        expect(response.body.message).toBe('Yes Greeting')
    });

});