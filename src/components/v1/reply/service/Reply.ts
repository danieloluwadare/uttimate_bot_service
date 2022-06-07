import Exception from '../../../../helpers/exception';
import { Reply, ReplyDoc } from '../model/reply';

type ReplyDto = {
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
        return Reply.create({data})
    }
}

export default ReplyService.getInstance()
