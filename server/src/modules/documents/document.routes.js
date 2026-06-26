import { Router } from "express";
import { protect } from "../../middleware/auth.middleware.js";
import upload from "../../middleware/upload.middleware.js";
import { uploadDocuments, getUserDocuments, deleteDocument } from "./document.controller.js";

const router = Router();

router.post("/upload",protect, upload.array("documents",10), uploadDocuments);
router.get("/",protect,getUserDocuments);
router.delete("/:id", protect, deleteDocument);


export default router;