import Nutrition from "../models/nutrition.js";
import User from "../models/user.js";
import axios from "axios";

//get daily nutrition requirements based on biometric data
export const getDailyNutritionRequirements = async (req, res) => {
    const userBiometricInfo = req.body.characteristics; // Get user biometric information from request body
    const nutritionPlan = req.body.nutritionPlan;
    try{
        const nutritionRequirements = calculateNutritionRequirements(userBiometricInfo, nutritionPlan);
        if(!nutritionRequirements){
            return res.status(400).json({ message: "Unable to calculate nutrition requirements" });
        }
        res.status(200).json(nutritionRequirements.data);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};


// calculate nutrition requirements
export const calculateNutritionRequirements = (characteristics, nutritionPlan) => {
    const { gender, age, weight, height } = characteristics;    
    const nutritionPlan = nutritionPlan || 'maintenance'
    const nutritionPlanForQuery = ""

    // set multiplier by nutrition plan
    switch(nutritionPlan){
        case 'weight_loss':
            nutritionPlanForQuery = 'Low Active';
            break;
        case 'weight_gain':
            nutritionPlanForQuery = 'Very Active';
            break;
        case 'maintenance':
            nutritionPlanForQuery = 'Active';
            break;
        default:
            nutritionPlanForQuery = 'Active';
    }

    try{
        const params = {
        measurement_units: 'met',
        sex: gender,
        age_value: age,
        age_type: 'yrs',
        cm: height,
        kilos: weight,
        activity_level: nutritionPlanForQuery
        };
        const nutritionRequirements = axios.get(
            `${process.env.NUTRITION_API_HOST}/api/nutrition`,
            params,
            {
                'x-rapidapi-host': process.env.NUTRITION_API_KEY,
                'x-rapidapi-key': process.env.NUTRITION_API_HOST
            }
        )
        return nutritionRequirements
    }catch(error){
        console.log(error);
        return null;
    }
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