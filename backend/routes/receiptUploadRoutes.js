import express from "express";
import upload from "../middleware/upload"
import { requestReceiptOCR } from "../controllers/receiptUploadController";

const router = express.Router();

router.post("/upload", upload, requestReceiptOCR)
export default router;