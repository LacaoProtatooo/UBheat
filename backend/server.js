// filepath: /backend/server.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db.js";
import app from "./app.js";

// Huhu
// import { fileURLToPath } from "url";  // Needed for __dirname in ES modules
// import authRoutes from "./routes/authRoutes.js";
// import chatRoutes from "./routes/chatRoutes.js"; 
// import userRoutes from './routes/userRoutes.js';
// import cors from "cors";
// import axios from 'axios';

dotenv.config();

const PORT = process.env.PORT || 5000
const __dirname = path.resolve();

// Fix for __dirname in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

connectDB();
app.use(express.json()); // Allows JSON data in req.body

// Enable CORS for all routes
// app.use(cors({
//   origin: ['http://localhost:5173', 'http://localhost:5000'], // Allow requests from these origins
//   credentials: true, // Allow cookies to be sent
// }));

// Middleware for cookie-parser
// import cookieParser from "cookie-parser";
// app.use(cookieParser());

console.log(process.env.MONGO_URI);

// Use routes
// app.use("/api/auth", authRoutes);
// app.use("/api/chat", chatRoutes);
// app.use('/api/users', userRoutes);

// OAuth configuration
// const GOOGLE_CLIENT_ID = "YOUR_CORRECT_GOOGLE_CLIENT_ID"; // Replace with actual client ID
// const GOOGLE_CLIENT_SECRET = "YOUR_CORRECT_CLIENT_SECRET"; // Replace with actual client secret

// // Google OAuth callback route
// app.get('/auth/google/callback', async (req, res) => {
//   const { code } = req.query;
//   try {
//     const { data } = await axios.post('https://oauth2.googleapis.com/token', {
//       code,
//       client_id: GOOGLE_CLIENT_ID,
//       client_secret: GOOGLE_CLIENT_SECRET,
//       redirect_uri: 'http://localhost:5000/auth/google/callback',
//       grant_type: 'authorization_code',
//     });
    
//     // Extract user info
//     const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
//       headers: { Authorization: `Bearer ${data.access_token}` }
//     });
    
//     const userInfo = userInfoResponse.data;
    
//     // Use the userInfo to find or create a user in your database
//     // This is just pseudo-code - implement according to your User model
//     // const user = await findOrCreateUser(userInfo.email, userInfo.name);
    
//     // Generate a token and redirect to frontend
//     // const token = generateToken(user);
    
//     res.redirect(`http://localhost:5173/oauth-success?token=${data.id_token}`);
//   } catch (error) {
//     console.error('Error during Google OAuth callback:', error.response?.data || error.message);
//     res.status(500).send('Authentication failed');
//   }
// });

// Static files and fallback routes for production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// Fallback for unknown routes
// app.use((req, res, next) => {
//   res.status(404).json({
//     success: false,
//     message: "Resource not found",
//   });
// });

// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// });

// process.on("unhandledRejection", (err) => {
//   console.error(`Unhandled Rejection: ${err.message}`);
//   process.exit(1);
// });

app.listen(PORT, () => {
  connectDB();
  console.log("Server Started at http://localhost:" + PORT);
});