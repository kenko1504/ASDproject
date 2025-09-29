import express from "express";
import {authenticateToken} from "../middleware/auth.js";
import multer from "multer"; // for handling multipart/form-data, which is primarily used for uploading files
import {
    createIngredient,
    getIngredients
} from "../controllers/ingredientController.js";


const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "imageUploads/"); // folder in your backend
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
//CRUD endpoints
router.post("/", authenticateToken, upload.single("image"), createIngredient);     // add ingredient
router.get("/", authenticateToken, getIngredients);        // get all ingredients


export default router;