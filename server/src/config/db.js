import mongoose from "mongoose";
import env from "./env.js";

export const connectDB = async() => {
    try {
        await mongoose.connect(env.MONGODB_URI);

        console.log("MongoDB Connected");

    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
}