import express from "express";
import {authenticateToken} from "../middleware/auth.js";
import multer from "multer"; // for handling multipart/form-data, which is primarily used for uploading files
import {
    createIngredient,
    getIngredients,
    getIngredientById,
    updateIngredient,
    deleteIngredient,
} from "../controllers/ingredientController.js";


const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "imageUploads/"),
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});
const upload = multer({storage});
//CRUD endpoints
router.post("/", authenticateToken, upload.single('image'), createIngredient);     // add ingredient
router.get("/", authenticateToken, getIngredients);        // get all ingredients
router.get("/:id", authenticateToken, getIngredientById); // read by id
router.put("/:id", authenticateToken, upload.single('image'), updateIngredient); // update by id
router.delete("/:id", authenticateToken, deleteIngredient); // delete by id

export default router;