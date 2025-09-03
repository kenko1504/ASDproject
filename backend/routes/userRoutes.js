import express from "express";
import { createUser, deleteUser, updateUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", createUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

export default router;