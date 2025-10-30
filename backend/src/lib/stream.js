import {StreamChat} from 'stream-chat'
import 'dotenv/config'

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.errror("Stream api key or api secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey,apiSecret)

export const upsertStreamUser = async (userData ) =>{
    try {
        
        await streamClient.upsertUsers([userData]);
        return userData;

    } catch (error) {
        console.error("Error upserting Stream users : ",error)
    }
}


// todo later
export const generateStreamToken = (userId) =>{

    try {

        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr)
        
    } catch (error) {
        console.error("Error in generating  Stream Token",error)
    }
}