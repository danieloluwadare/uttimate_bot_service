import {Reply} from "../../../../../../components/v1/reply/model/reply";
import ReplyService from "../../../../../../components/v1/reply/service/Reply"
describe('Unit Reply Service', () => {
    it('should call create', () => {
        Reply.create = jest.fn().mockReturnValue({
            intent: "string",
            body: "string",
            minimumConfidence: 0.88
        })

        ReplyService.create({
            intent: "string",
            body: "string",
            minimumConfidence: 0.88
        })
        const  res =(Reply.create as jest.Mock).mock.calls[0][0]
        expect(Reply.create).toHaveBeenCalled()
        expect(res.body).toMatch(/string/)
        expect(res.intent).toMatch(/string/)
        expect(res.minimumConfidence).toBe(0.88)

    });


    it('should call findOne', () => {
        // Reply.create = jest.fn().mockReturnValue({})
        Reply.findOne = jest.fn().mockReturnValue({
            intent: "string",
            body: "string",
            minimumConfidence: 0.88
        })
        ReplyService.findBy("string", 0.88)
        const res =(Reply.create as jest.Mock).mock.calls[0][0]
        expect(Reply.findOne).toHaveBeenCalled()
    });
});