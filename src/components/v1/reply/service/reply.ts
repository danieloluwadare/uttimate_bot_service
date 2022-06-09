import {Reply, ReplyDoc} from '../model/reply';

export interface ReplyDto{
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

    async findBy(intent :string, confidenceScore : number) {
        return Reply.findOne(
            {
                intent: intent,
                minimumConfidence: {$lte: confidenceScore},
            })
    }

    async findAll(){
        return Reply.find({})
    }

    async createAllIfNotExist(data: ReplyDto[]){
        const replies = await this.findAll()
        const mapOfIntentToReply = this.getMapOfIntentToReply(replies)
        const newReplies : ReplyDto[] = []
        data.forEach(reply=>{
            if(!mapOfIntentToReply.has(reply.intent))
                newReplies.push(reply)
        })
        if(newReplies.length > 0)
            await Reply.create(newReplies)
    }

    private getMapOfIntentToReply(replies : ReplyDoc[]){
        const map = new Map<string, string>()
        replies.map(reply=>map.set(reply.intent, reply.body))
        console.log(map)
        return map
    }
}

export default ReplyService.getInstance()
