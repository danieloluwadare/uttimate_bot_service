import {Reply} from '../model/reply';

interface ReplyDto{
    intent: string;
    body: string;
    minimumConfidence: number;
};

class ReplyService {
    private static instance: ReplyService;

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
    public static getInstance(): ReplyService {
        if (!ReplyService.instance) {
            ReplyService.instance = new ReplyService();
        }

        return ReplyService.instance;
    }

    async create(data: ReplyDto) {
        return await Reply.create({...data})
    }

    async findBy(intent :string, confidenceScore : number){
        return Reply.findOne(
            {
                intent: intent,
                minimumConfidence: {$gt: confidenceScore},
            });
    }
}

export default ReplyService.getInstance()
