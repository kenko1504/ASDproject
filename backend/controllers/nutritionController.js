import Nutrition from "../models/nutrition.js";
import User from "../models/user.js";

// Get User Biometric Data
export const getUserBiometricData =  () => {
    try {
        const bioData = localStorage.getItem('characteristics') ? JSON.parse(localStorage.getItem('characteristics')) : null;
        const nutritionPlan = localStorage.getItem('nutritionPlan') ? JSON.parse(localStorage.getItem('nutritionPlan')) : null;
        if (!bioData || !nutritionPlan) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ bioData, nutritionPlan });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//get daily nutrition requirements based on biometric data
export const getDailyNutritionRequirements = async (req, res) => {
    
}

// calculate nutrition requirements
export const calculateNutritionRequirements = (characteristics, nutritionPlan) => {
    // Placeholder logic for calculating nutrition requirements
    const { gender, age, weight, height } = characteristics;
    const currentPlan = nutritionPlan;

    
    
}

// Get All Nutrition Data
export const getAllNutrition = async (req, res) => {
    try {
        const items = await Nutrition.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Specific Nutrition Data
export const getNutrition = async (req, res) => {
    const item = await Nutrition.findById(req.params.id);
    if (!item) return res.status(404).json({message: "Item not found"});
    res.json(item);
};