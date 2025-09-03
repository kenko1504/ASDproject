import Food from "../models/food.js";

// Get All Food Data
export const getAllFood = async (req, res) => {
    const items = await Food.find();
    res.json(items);
};

// Get Specific Food Data
export const getFood = async (req, res) => {
    const item = await Food.findById(req.params.id);
    if (!item) return res.status(404).json({message: "Item not found"});
    res.json(item);
};