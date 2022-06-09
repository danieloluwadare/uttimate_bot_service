import {Reply} from "../../../../../../components/v1/reply/model/reply";
import ReplyService, {ReplyDto} from "../../../../../../components/v1/reply/service/reply"
describe('Unit Reply Service', () => {
    it('should call create', () => {
        Reply.create = jest.fn().mockReturnValue({
            intent: "string",
            body: "string",
            minimumConfidence: 0.88,
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


    it('should call findOne', async () => {
        // Reply.create = jest.fn().mockReturnValue({})
        Reply.findOne = jest.fn().mockReturnValue({
            intent: "string",
            body: "string",
            minimumConfidence: 0.88,
            __v:0
        })
        await ReplyService.findBy("string", 0.98)
        const res =(Reply.create as jest.Mock).mock.calls[0][0]
        expect(Reply.findOne).toHaveBeenCalled()
    });

    it('should create replies that do not exist', async () => {
        // Reply.create = jest.fn().mockReturnValue({})
        const findAllReplies = [
            {
                intent: "Greeting",
                body: "Hello",
                minimumConfidence: 0.88
            },
            {
                intent: "GoodBye",
                body: "Bye",
                minimumConfidence: 0.89
            },
            {
                intent: "Purchase",
                body: "Bye",
                minimumConfidence: 0.89
            }
        ]
        const newReplies  = [
            {
                intent: "Buy",
                body: "Hello",
                minimumConfidence: 0.88
            },
            {
                intent: "Withdraw",
                body: "Bye",
                minimumConfidence: 0.89
            }
        ]
        ReplyService.findAll = jest.fn().mockReturnValue(findAllReplies)
        Reply.create = jest.fn()
        await ReplyService.createAllIfNotExist(newReplies)

        const  res : ReplyDto [] =(Reply.create as jest.Mock).mock.calls[0][0]
        expect(Reply.create).toHaveBeenCalled()
        expect(res.length).toEqual(2)
        expect(res[0].intent).toMatch(/Buy/)
        expect(res[1].intent).toMatch(/Withdraw/)

    });

    it('should not create replies that do not exist', async () => {
        // Reply.create = jest.fn().mockReturnValue({})
        const findAllReplies = [
            {
                intent: "Greeting",
                body: "Hello",
                minimumConfidence: 0.88
            },
            {
                intent: "GoodBye",
                body: "Bye",
                minimumConfidence: 0.89
            },
            {
                intent: "Purchase",
                body: "Bye",
                minimumConfidence: 0.89
            }
        ]
        const newReplies  = findAllReplies
        ReplyService.findAll = jest.fn().mockReturnValue(findAllReplies)
        Reply.create = jest.fn()
        await ReplyService.createAllIfNotExist(newReplies)

        expect(Reply.create).toBeCalledTimes(0)

    });
});