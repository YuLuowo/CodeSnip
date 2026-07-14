import mongoose from "mongoose";

let isConnected = false;

export async function connectDB(): Promise<void> {
    if (isConnected) return;

    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        isConnected = true;
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
    }
}
