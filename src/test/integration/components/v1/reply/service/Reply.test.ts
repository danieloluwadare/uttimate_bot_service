import ReplyService from "../../../../../../components/v1/reply/service/reply";

describe('Reply Service', () => {
    it('should create a reply', async () => {
        const response = await ReplyService.create({
            intent: "string",
            body: "string",
            minimumConfidence: 0.88
        })
        expect(response._id).toBeDefined()
    });

    it('should fetch a reply by intent and minimum confidence', async () => {
        let collections = [
            {
                intent: "Greeting",
                body: "Hello",
                minimumConfidence: 0.88
            },
            {
                intent: "GoodBye",
                body: "Bye",
                minimumConfidence: 0.89
            }
        ]

        for (const collection of collections) {
            await ReplyService.create(collection)
        }
        const reply = await ReplyService.findByIntentAndConfidenceSore("GoodBye", 0.90)
        expect(reply?._id).toBeDefined()
    });
});