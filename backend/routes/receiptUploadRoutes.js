import express from "express";
import upload from "../middleware/upload.js"
import { requestReceiptOCR } from "../controllers/receiptUploadController.js";

const router = express.Router();

router.post("/upload", upload.single('image'), requestReceiptOCR)
export default router;