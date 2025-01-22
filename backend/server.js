
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000
const __dirname = path.resolve();

app.use(express.json());  // Allows to accept JSON data in the req.body

console.log(process.env.MONGO_URI);

// if(process.env.NODE_ENV === "production"){
//     app.use(express.static(path.join(__dirname, "/frontend/dist")));

//     app.get("*", (req, res)=>{
//         res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
//     })
// }

app.listen(PORT, () => {
    connectDB();
    console.log("Server Started at http://localhost:" + PORT);
});
