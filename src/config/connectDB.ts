import mongoose from "mongoose";


const connectDB = async (): Promise<void> => {
    try{
        const URI : string | undefined = process.env.MONGO_URI;
        if(!URI){
            throw new Error("MONGO_URI is not defined in the environmental varibles");
        }
        await mongoose.connect(URI)
        console.log("Database connection successfully")
    }catch(error){
        console.error(`Database connection failed ${error}`)
    }
}

export default connectDB;
