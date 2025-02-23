import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";  // Needed for __dirname in ES modules
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js"; // Import chatRoutes
import cors from "cors"; // Change require to import
import userRoutes from './routes/userRoutes.js'; // Import user routes
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();
app.use(express.json()); // Allows JSON data in req.body

// Enable CORS for all routes
app.use(cors());

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

process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

app.listen(PORT, () => {
  connectDB();
  console.log("Server Started at http://localhost:" + PORT);
});