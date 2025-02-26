// filepath: /c:/Users/donna/OneDrive/Desktop/UBheat/UBheat/backend/server.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";  // Needed for __dirname in ES modules
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js"; // Import chatRoutes
import cors from "cors"; // Change require to import
import userRoutes from './routes/userRoutes.js'; // Import user routes
import axios from 'axios'; // Import axios for HTTP requests

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();
app.use(express.json()); // Allows JSON data in req.body

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true, // Allow cookies to be sent
}));

console.log(process.env.MONGO_URI);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.use("/api/auth", authRoutes);
  app.use("/api/chat", chatRoutes); // Use chatRoutes
  app.use('/api/users', userRoutes); // Use userRoutes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  // Use routes in development mode as well
  app.use("/api/auth", authRoutes);
  app.use("/api/chat", chatRoutes); // Use chatRoutes
}

// Google OAuth callback route
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: 'http://localhost:3000/auth/google/callback',
      grant_type: 'authorization_code',
    });
    // Verify the token and authenticate the user
    // You can use data.id_token to verify the user
    res.redirect('http://localhost:5173'); // Redirect to the desired URL
  } catch (error) {
    console.error('Error during Google OAuth callback:', error);
    res.status(500).send('Authentication failed');
  }
});

// GitHub OAuth callback route
app.get('/auth/github/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { data } = await axios.post('https://github.com/login/oauth/access_token', {
      code,
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      redirect_uri: 'http://localhost:3000/auth/github/callback',
    }, {
      headers: {
        Accept: 'application/json',
      },
    });
    // Verify the token and authenticate the user
    // You can use data.access_token to verify the user
    res.redirect('http://localhost:5173'); // Redirect to the desired URL
  } catch (error) {
    console.error('Error during GitHub OAuth callback:', error);
    res.status(500).send('Authentication failed');
  }
});

process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

app.listen(PORT, () => {
  connectDB();
  console.log("Server Started at http://localhost:" + PORT);
});