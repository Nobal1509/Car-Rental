import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// Initialize Express App
const app = express()

const allowedOrigins = [
    /^https?:\/\/localhost:\d+$/,
    /^https:\/\/.*\.vercel\.app$/
];

const corsOptions = {
    origin: (origin, callback) => {
        const isAllowed = !origin || allowedOrigins.some((pattern) => pattern.test(origin));
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Connect Database
connectDB().catch((err) => console.error("Initial DB connection error:", err.message));

// CORS must be applied before routes and explicitly handle preflight requests.
app.use(cors(corsOptions));
app.options('/{*splat}', cors(corsOptions));

app.use(express.json());

// Middleware to ensure DB connection is ready in serverless environments
app.use(async (req, res, next) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
        }
    } catch (e) {
        console.error("Database connection middleware error:", e.message);
    }
    next();
});

app.get('/', (req, res)=> res.send("Server is running"))
app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRouter)

// Global Error Handler to guarantee JSON responses with CORS headers
app.use((err, req, res, next) => {
    console.error("Unhandled server error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
    app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))
}

export default app;