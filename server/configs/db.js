import mongoose from "mongoose";

const connectDB = async () => {
    // If already connected or connecting, reuse connection
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes("Enter your mongoDB URI")) {
        console.error("MONGODB_URI is not configured in .env / environment variables");
        return;
    }

    try {
        await mongoose.connect(uri, {
            dbName: "car-rental"
        });
        console.log("Database Connected successfully");
    } catch (error) {
        console.error("Database connection error:", error.message);
    }
}

export default connectDB;