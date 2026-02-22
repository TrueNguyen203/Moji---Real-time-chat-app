import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log("Succesfully connect with database");
    } catch (error) {
        console.log("Error while connecting with database", error.message)
        process.exit(1)
    }
}