import Nutrition from "../models/nutrition.js";

// Get All Nutrition Data
export const getAllNutrition = async (req, res) => {
    const items = await Nutrition.find();
    res.json(items);
};

// Get Specific Nutrition Data
export const getNutrition = async (req, res) => {
    const item = await Nutrition.findById(req.params.id);
    if (!item) return res.status(404).json({message: "Item not found"});
    res.json(item);
};