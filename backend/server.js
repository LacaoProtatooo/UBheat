// filepath: /backend/server.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Connect to your database once
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

console.log(process.env.MONGO_URI);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}


app.listen(PORT, () => {
  console.log("Server Started at http://localhost:" + PORT);
});
