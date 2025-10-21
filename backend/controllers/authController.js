import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// LOGIN controller
export const loginUser = async (req, res) => {
  const { username, password, totpToken } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Check if TOTP is enabled
    if (user.totpEnabled) {
      // If TOTP token is not provided, indicate that it's required
      if (!totpToken) {
        return res.status(200).json({
          totpRequired: true,
          userId: user._id,
          message: "TOTP verification required"
        });
      }

      // Verify TOTP token
      const speakeasy = (await import("speakeasy")).default;

      // Check if it's a backup code
      let isBackupCode = false;
      let backupCodeIndex = -1;

      for (let i = 0; i < user.backupCodes.length; i++) {
        const match = await bcrypt.compare(totpToken, user.backupCodes[i]);
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
      } else {
        // Verify TOTP token
        const verified = speakeasy.totp.verify({
          secret: user.totpSecret,
          encoding: "base32",
          token: totpToken,
          window: 2,
        });

        if (!verified) {
          return res.status(401).json({ error: "Invalid TOTP code" });
        }
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    // Remove password and sensitive TOTP data from user object before sending
    const userResponse = {
      ...user.toObject(),
      password: undefined,
      totpSecret: undefined,
      backupCodes: undefined
    };

    res.status(200).json({
      message: "Login successful",
      user: userResponse,
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};