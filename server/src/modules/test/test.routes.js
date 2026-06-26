import { Router } from "express";
import { testEmbedding, askQuestion } from "./test.controller.js";

const router = Router();

router.get("/embedding", testEmbedding);
router.post("/ask", askQuestion);

export default router;