import { Router } from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { registerUser, loginUser, getProfile } from "./auth.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile",protect, getProfile);

export default router;