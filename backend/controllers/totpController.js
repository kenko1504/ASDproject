import User from "../models/user.js";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Setup TOTP - Generate secret and QR code
export const setupTOTP = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.totpEnabled) {
      return res.status(400).json({ error: "TOTP is already enabled" });
    }

    // Generate a secret
    const secret = speakeasy.generateSecret({
      name: `FridgeManager (${user.email})`,
      issuer: "FridgeManager",
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Store temporary secret (not saved to DB yet)
    res.status(200).json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
      message: "Scan this QR code with your authenticator app",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Enable TOTP - Verify first code and save secret
export const enableTOTP = async (req, res) => {
  try {
    const userId = req.userId;
    const { token, secret } = req.body;

    if (!token || !secret) {
      return res.status(400).json({ error: "Token and secret are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: token,
      window: 2, // allows 60 seconds of time drift
    });

    if (!verified) {
      return res.status(401).json({ error: "Invalid verification code" });
    }

    // Generate backup codes
    const backupCodes = [];
    for (let i = 0; i < 8; i++) {
      const code = crypto.randomBytes(4).toString("hex").toUpperCase();
      backupCodes.push(code);
    }

    // Hash backup codes before storing
    const hashedBackupCodes = await Promise.all(
      backupCodes.map((code) => bcrypt.hash(code, 10))
    );

    // Save secret and enable TOTP
    user.totpSecret = secret;
    user.totpEnabled = true;
    user.backupCodes = hashedBackupCodes;
    await user.save();

    res.status(200).json({
      message: "TOTP enabled successfully",
      backupCodes: backupCodes, // Send plain codes once, user must save them
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Disable TOTP - Requires password confirmation
export const disableTOTP = async (req, res) => {
  try {
    const userId = req.userId;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.totpEnabled) {
      return res.status(400).json({ error: "TOTP is not enabled" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Disable TOTP
    user.totpSecret = null;
    user.totpEnabled = false;
    user.backupCodes = [];
    await user.save();

    res.status(200).json({ message: "TOTP disabled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify TOTP during login
export const verifyTOTP = async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({ error: "User ID and token are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.totpEnabled) {
      return res.status(400).json({ error: "TOTP is not enabled" });
    }

    // Check if it's a backup code
    let isBackupCode = false;
    let backupCodeIndex = -1;

    for (let i = 0; i < user.backupCodes.length; i++) {
      const match = await bcrypt.compare(token, user.backupCodes[i]);
      if (match) {
        isBackupCode = true;
        backupCodeIndex = i;
        break;
      }
    }

    if (isBackupCode) {
      // Remove used backup code
      user.backupCodes.splice(backupCodeIndex, 1);
      await user.save();
      return res.status(200).json({
        verified: true,
        message: "Backup code verified",
        remainingBackupCodes: user.backupCodes.length
      });
    }

    // Verify TOTP token
    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: "base32",
      token: token,
      window: 2,
    });

    if (!verified) {
      return res.status(401).json({ error: "Invalid verification code" });
    }

    res.status(200).json({ verified: true, message: "TOTP verified" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Regenerate backup codes
export const regenerateBackupCodes = async (req, res) => {
  try {
    const userId = req.userId;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.totpEnabled) {
      return res.status(400).json({ error: "TOTP is not enabled" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate new backup codes
    const backupCodes = [];
    for (let i = 0; i < 8; i++) {
      const code = crypto.randomBytes(4).toString("hex").toUpperCase();
      backupCodes.push(code);
    }

    // Hash backup codes before storing
    const hashedBackupCodes = await Promise.all(
      backupCodes.map((code) => bcrypt.hash(code, 10))
    );

    user.backupCodes = hashedBackupCodes;
    await user.save();

    res.status(200).json({
      message: "Backup codes regenerated successfully",
      backupCodes: backupCodes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get TOTP status
export const getTOTPStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      totpEnabled: user.totpEnabled,
      backupCodesCount: user.backupCodes.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
