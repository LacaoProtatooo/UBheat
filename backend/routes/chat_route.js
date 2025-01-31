import express from "express";
import mongoose from "mongoose";

import { getChatResponse } from "../controllers/groqcloud_controller.js";

const router = express.Router();

router.post("/", getChatResponse);

export default router;