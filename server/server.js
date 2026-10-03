import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// Initialize Express App
const app = express()

const allowedOrigins = [
    /^https?:\/\/localhost(:\d+)?$/,
    /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
    /^https:\/\/.*\.vercel\.app$/,
    /^https:\/\/.*\.onrender\.com$/,
    ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((u) => u.trim()) : [])
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or same-origin)
        if (!origin) {
            return callback(null, true);
        }
        const isAllowed = allowedOrigins.some((pattern) => {
            if (pattern instanceof RegExp) {
                return pattern.test(origin);
            }
            return pattern === origin;
        });
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

// Health check endpoint for Render and monitoring
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/bookings', bookingRouter);

// Catch-all for undefined /api routes
app.all('/api/{*splat}', (req, res) => {
    res.status(404).json({ success: false, message: "API endpoint not found" });
});

// Frontend Static File Serving & SPA Fallback
const clientDistPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../client/dist"
);

if (existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
    app.get(/^\/(?!api(?:\/|$)).*/, (req, res) => {
        res.sendFile(path.join(clientDistPath, "index.html"));
    });
} else {
    app.get('/', (req, res) => res.send("Server is running"));
}

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
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}

export default app;