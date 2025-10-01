import Nutrition from "../models/nutrition.js";
import axios from "axios";

//get daily nutrition requirements based on biometric data
export const getDailyNutritionRequirements = async (req, res) => {
    const userBiometricInfo = req.body.characteristics; // Get user biometric information from request body
    const nutritionPlan = req.body.nutritionPlan;
    try{
        const nutritionRequirements = calculateNutritionRequirements(userBiometricInfo, nutritionPlan);
        console.log(nutritionRequirements)
        if(!nutritionRequirements){
            return res.status(400).json({ message: "Unable to calculate nutrition requirements" });
        }
        const calories = nutritionRequirements.BMI_EER["Estimated Daily Caloric Needs"]
        const macronutrientsTable = nutritionRequirements.macronutrients_table["macronutrients-table"]
        const mineralsTable = nutritionRequirements.minerals_table["essential-minerals-table"]
        const targetNutrients = ["carbohydrate", "protein", "fat"]
        const targetMinerals = ["sodium"]
        
        const filteredData = {}

        filteredData["calories"] = calories
        
        macronutrientsTable.forEach((row, index) => {
            if (index != 0 && targetNutrients.includes(row[0])) {
                filteredData[row[0]] = row[1];
            }
        });

        mineralsTable.forEach((row, index) => {
            if (index != 0 && targetMinerals.includes(row[0])) {
                filteredData[row[0]] = row[1];
            }
        });

        console.log(filteredData)
        res.status(200).json(filteredData);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};


// calculate nutrition requirements
export const calculateNutritionRequirements = async (characteristics, nutritionPlan) => {
    const { gender, age, weight, height } = characteristics;    
    const modifier = nutritionPlan || 'maintenance'
    let nutritionPlanForQuery = ""

    // set multiplier by nutrition plan
    switch(modifier){
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
            break;
    }

    console.log(nutritionPlanForQuery)

    try{
        const params = {
        measurement_units: 'met',
        sex: gender.toLowerCase(),
        age_value: age,
        age_type: 'yrs',
        cm: height,
        kilos: weight,
        activity_level: nutritionPlanForQuery
        };
        const nutritionRequirements = await axios.get(
            `https://${process.env.NUTRITION_API_HOST}/api/nutrition-info`,
            {
                params: params,
                headers: {       
                    'x-rapidapi-host': process.env.NUTRITION_API_HOST,
                    'x-rapidapi-key': process.env.NUTRITION_API_KEY
                }
            }
        )
        console.log(nutritionRequirements.data)
        return nutritionRequirements.data
    }catch(error){
        throw error;
    }
}

// Get All Foods Nutrition Data
export const getAllNutrition = async (req, res) => {
    try {
        const items = await Nutrition.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Specific Food Nutrition Data
export const getNutrition = async (req, res) => {
    const item = await Nutrition.findById(req.params.id);
    if (!item) return res.status(404).json({message: "Item not found"});
    res.json(item);
};