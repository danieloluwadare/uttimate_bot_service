import {IntentService} from "../../../../../../components/v1/intent/service/Intent";
import axios from "axios";
import config from "../../../../../../config";

describe('Unit Intent Service', () => {
    it('should fetch an intent by botId and message', async () => {
        const axiosResponse = {
            data: {
                "intents": [
                    {
                        "confidence": 0.9850270748138428,
                        "name": "Thank you"
                    },
                    {
                        "confidence": 0.001257029827684164,
                        "name": "Returning order"
                    }
                ],
                "entities": []
            }
        }
        axios.post = jest.fn().mockReturnValue(axiosResponse)

        const response = await IntentService.fetchIntent({botId: "5552768287", message: "message"})
        const axiosData = (axios.post as jest.Mock).mock.calls[0][1]
        console.log(axiosData)

        expect(axios.post).toHaveBeenCalled()

        expect(axiosData.botId).toMatch(/5552768287/)
        expect(axiosData.message).toMatch(/message/)

        const axiosConfig = (axios.post as jest.Mock).mock.calls[0][2]
        console.log(axiosConfig)
        expect(axiosConfig.headers.Authorization).toEqual(config.ultimateAiAuthorization)
    });


});