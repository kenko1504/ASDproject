import express from "express";
import { createUser, deleteUser, updateUser, getSavedRecipes, addSavedRecipe, removeSavedRecipe, addRecentRecipe, getRecentRecipes, searchUsers, adminUpdateUser } from "../controllers/userController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", createUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

// Admin-only user management routes
router.get("/search", authenticateToken, requireAdmin, searchUsers);
router.put("/:id/admin", authenticateToken, requireAdmin, adminUpdateUser);

// Saved recipes routes
router.get("/:userId/saved-recipes", getSavedRecipes);
router.post("/:userId/saved-recipes", addSavedRecipe);
router.delete("/:userId/saved-recipes", removeSavedRecipe);

// Recent recipes routes
router.get("/:userId/recent-recipes", getRecentRecipes);
router.post("/:userId/recent-recipes", addRecentRecipe);

export default router;