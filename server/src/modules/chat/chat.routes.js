import { Router } from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { askQuestion, getChatHistory } from "./chat.controller.js";

const router = Router();

router.post("/ask", protect, askQuestion);

router.get("/history", protect, getChatHistory);

export default router;