import express from "express";
import { loginUser } from "../controllers/authController.js";
import { setupTOTP, enableTOTP, disableTOTP, regenerateBackupCodes, getTOTPStatus } from "../controllers/totpController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Authentication routes
router.post("/login", loginUser);

// TOTP routes (require authentication)
router.get("/totp/status", authenticateToken, getTOTPStatus);
router.post("/totp/setup", authenticateToken, setupTOTP);
router.post("/totp/enable", authenticateToken, enableTOTP);
router.post("/totp/disable", authenticateToken, disableTOTP);
router.post("/totp/backup-codes", authenticateToken, regenerateBackupCodes);

export default router;