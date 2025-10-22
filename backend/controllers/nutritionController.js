import FoodNutrition from "../models/foodNutrition.js";

//get daily nutrition requirements based on biometric data
export const getDailyNutritionRequirements = (req, res) => {
    const userBiometricInfo = req.body.characteristics;
    const nutritionPlan = req.body.nutritionPlan;
    try{
        const nutritionRequirements = calculateNutritionRequirements(userBiometricInfo, nutritionPlan);
        if(!nutritionRequirements){
            return res.status(500).json({ message: "Unable to calculate nutrition requirements" });
        }
        console.log('nutritionRequirements:', nutritionRequirements);
        res.status(200).json(nutritionRequirements);
    }catch(error){
        console.error(error.response?.data || error.message || error);
        res.status(500).json({ message: error.response?.data || error.message || 'Server error' });
    }
};

// calculate nutrition requirements
const calculateNutritionRequirements = (characteristics, nutritionPlan) => {
    const { gender, age, weight, height } = characteristics || {};
    const modifier = nutritionPlan || 'maintenance';
    let activityMultiplier = 0.0;
    let goalVar = 0;
    let proteinMultiplier = 0.0;

    let BMR = 0.0;

    switch(modifier){
        case 'weight_loss':
            activityMultiplier = 1.2;
            proteinMultiplier = 0.8;
            goalVar = -500
            break;
        case 'weight_gain':
            activityMultiplier = 1.55;
            proteinMultiplier = 2.25;
            goalVar = 400
            break;
        case 'maintenance':
            activityMultiplier = 1.375;
            proteinMultiplier = 1.8;
            break;
        default:
            activityMultiplier = 1.375;
            proteinMultiplier = 1.8;
            break;
    }
    switch(gender){
        case 'Male':
            BMR = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
            break;
        case 'Female':
            BMR = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
            break;
    }
    console.log(BMR, '*', activityMultiplier, "+", goalVar)
    const TDEE = BMR * activityMultiplier + goalVar;

    const protein = proteinMultiplier * weight;
    const fat = 1.0 * weight;
    const carbCalories = TDEE - (protein*4 + fat*9)
    const carb = carbCalories / 4
    const sodium = 1500;

    const result = {
        calories: TDEE,
        protein: protein,
        fat: fat,
        carbohydrates: carb,
        sodium: sodium
    }

    console.log(result)
    return result
}

// Get All Foods Nutrition Data
export const getAllNutrition = async (req, res) => {
    try {
        const items = await FoodNutrition.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Specific Food Nutrition Data
export const getNutrition = async (req, res) => {
    const item = await FoodNutrition.findById(req.params.id);
    if (!item) return res.status(404).json({message: "Item not found"});
    res.json(item);
};