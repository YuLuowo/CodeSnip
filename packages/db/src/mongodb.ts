import mongoose from "mongoose";

declare global {
    // eslint-disable-next-line no-var
    var _mongooseConnectPromise: Promise<typeof mongoose> | undefined;
}

export async function connectDB(): Promise<void> {
    if (mongoose.connection.readyState === 1) return;

    if (!global._mongooseConnectPromise) {
        global._mongooseConnectPromise = mongoose
            .connect(process.env.MONGODB_URI!)
            .then((conn) => {
                console.log("MongoDB Connected");
                return conn;
            })
            .catch((error) => {
                console.error("MongoDB Connection Error:", error);
                global._mongooseConnectPromise = undefined;
                throw error;
            });
    }

    await global._mongooseConnectPromise;
}
