import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import routes

// -------------

const app = express();

// Middleware for parsing request bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware
app.use(cookieParser());
const allowedOrigins = [
    "http://localhost:5173", // Development origin
    // Add Production origin here
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// Middleware for setting security headers
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

// Router Connection

// -----------------

// Fallback for unknown routes
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Resource not found",
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

export default app;
