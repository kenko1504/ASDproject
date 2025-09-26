import express from "express";
<<<<<<< Updated upstream
import { createUser, deleteUser, updateUser, getSavedRecipes, addSavedRecipe, removeSavedRecipe } from "../controllers/userController.js";
=======
import { createUser, deleteUser, updateUser, getSavedRecipes, addSavedRecipe, removeSavedRecipe, searchUsers, adminUpdateUser, addRecentRecipe, getRecentRecipes } from "../controllers/userController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
>>>>>>> Stashed changes

const router = express.Router();

router.post("/register", createUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

// Saved recipes routes
router.get("/:userId/saved-recipes", getSavedRecipes);
router.post("/:userId/saved-recipes", addSavedRecipe);
router.delete("/:userId/saved-recipes", removeSavedRecipe);

// Recent recipes routes
router.get("/:userId/recent-recipes", getRecentRecipes);
router.post("/:userId/recent-recipes", addRecentRecipe);

export default router;