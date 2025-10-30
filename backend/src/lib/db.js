import mongoose from 'mongoose'

export const connectDB = async ()=>{
    try {
       const conn =  await mongoose.connect(process.env.MONGO_URI);
       console.log(`MongoDB connnected : ${conn.connection.host}`)

    } catch (error) { 
        console.log(`Error connecting to mongoDB : ${error}`);
        process.exit(1) //mean means failure
    }
}