import axios from "axios";
import FoodNutrition from "../models/foodNutrition.js";

//get daily nutrition requirements based on biometric data
export const getDailyNutritionRequirements = async (req, res) => {
    const userBiometricInfo = req.body.characteristics;
    const nutritionPlan = req.body.nutritionPlan;
    try{
        const nutritionRequirements = await calculateNutritionRequirements(userBiometricInfo, nutritionPlan);
        if(!nutritionRequirements){
            return res.status(500).json({ message: "Unable to calculate nutrition requirements" });
        }
        console.log('nutritionRequirements:', nutritionRequirements);

        const caloriesRaw = nutritionRequirements?.BMI_EER?.['Estimated Daily Caloric Needs'] ?? '';
        const caloriesStr = String(caloriesRaw);
        console.log('Calculated calories:', caloriesStr);

        const macronutrientsTable = nutritionRequirements?.macronutrients_table?.["macronutrients-table"] ?? [];
        const mineralsTable = nutritionRequirements?.minerals_table?.["essential-minerals-table"] ?? [];
        const targetNutrients = ["carbohydrate", "protein", "fat"];
        const targetMinerals = ["sodium"];

        const filteredData = {};
        console.log("Filtering data...", targetNutrients.map(n => n.toLowerCase()));

        if (caloriesStr) {
            // "2,482 kcal/day" -> "2482"
            const cal = caloriesStr.split(" ")[0].replace(/,/g, '');
            if (!Number.isNaN(Number(cal))) filteredData["calories"] = cal;
        }

        macronutrientsTable.forEach((row, index) => {
            if (!row || index === 0) return;
            const key = String(row[0] ?? '').toLowerCase();
            if (targetNutrients.includes(key)) {
                const val = String(row[1] ?? '').split(" ")[0].replace(/,/g, '');
                filteredData[row[0]] = val;
            }
        });

        mineralsTable.forEach((row, index) => {
            if (!row || index === 0) return;
            const key = String(row[0] ?? '').toLowerCase();
            if (targetMinerals.includes(key)) {
                const val = String(row[1] ?? '').split(" ")[0].replace(/,/g, '');
                filteredData[row[0]] = val;
            }
        });

        console.log(filteredData);
        res.status(200).json(filteredData);
    }catch(error){
        console.error(error.response?.data || error.message || error);
        res.status(500).json({ message: error.response?.data || error.message || 'Server error' });
    }
};

// calculate nutrition requirements
const calculateNutritionRequirements = async (characteristics, nutritionPlan) => {
    const { gender, age, weight, height } = characteristics || {};
    const modifier = nutritionPlan || 'maintenance';
    let nutritionMultiplier = 0;

    switch(modifier){
        case 'weight_loss':
            nutritionMultiplier = 1.2;
            break;
        case 'weight_gain':
            nutritionMultiplier = 1.375;
            break;
        case 'maintenance':
            nutritionMultiplier = 1.55;
            break;
        default:
            nutritionMultiplier = 1.55;
            break;
    }

    switch(gender){
        case 'male':
            break;
        case 'female':
            break;
    }
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