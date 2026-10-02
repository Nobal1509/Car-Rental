import mongoose from "mongoose";

const connectDB = async () => {
    // If already connected or connecting, reuse connection
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    let uri = process.env.MONGODB_URI?.trim();
    if (uri && ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'")))) {
        uri = uri.slice(1, -1).trim();
    }

    if (!uri || uri.includes("Enter your mongoDB URI")) {
        console.error("MONGODB_URI is not configured in .env / environment variables");
        return;
    }

    if (!/^mongodb(?:\+srv)?:\/\//.test(uri)) {
        console.error("MONGODB_URI must start with mongodb:// or mongodb+srv://; check the Vercel environment variable value");
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