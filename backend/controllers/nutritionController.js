import axios from "axios";
import FoodNutrition from "../models/foodNutrition.js";

//get daily nutrition requirements based on biometric data
export const getDailyNutritionRequirements = async (req, res) => {
    const userBiometricInfo = req.body.characteristics; // Get user biometric information from request body
    const nutritionPlan = req.body.nutritionPlan;
    try{
        const nutritionRequirements = JSON.stringify(await calculateNutritionRequirements(userBiometricInfo, nutritionPlan));
        if(!nutritionRequirements){
            return res.status(400).json({ message: "Unable to calculate nutrition requirements" });
        }
        console.log('nutritionRequirements:', nutritionRequirements);

        // Extract relevant data from the nutritionRequirements
        const calories = nutritionRequirements.BMI_EER?.['Estimated Daily Caloric Needs'] || 0;
        console.log('Calculated calories:', calories);

        // Extract macronutrients and minerals from the tables
        const macronutrientsTable = nutritionRequirements.macronutrients_table["macronutrients-table"]
        const mineralsTable = nutritionRequirements.minerals_table["essential-minerals-table"]
        const targetNutrients = ["carbohydrate", "protein", "fat"]
        const targetMinerals = ["sodium"]

        console.log('macronutrientsTable:', macronutrientsTable);
        console.log('macronutrientsTable length:', macronutrientsTable?.length);
        console.log('mineralsTable:', mineralsTable);   
        console.log('mineralsTable length:', mineralsTable?.length);

        const filteredData = {}
        console.log("Filtering data...", targetNutrients.map(n => n.toLowerCase()))

        if(calories.includes(" ")){
            if(calories.includes(",")){
                filteredData["calories"] = calories.split(" ")[0].replace(',', '');
            }
        }

        macronutrientsTable.forEach((row, index) => {
            console.log(row[0], row[1] , "index:", index )
            if (index != 0 && targetNutrients.map(n => n.toLowerCase()).includes(row[0].toLowerCase())) {
                if(row[1].includes(" ")){
                    filteredData[row[0]] = row[1].split(" ")[0];
                }
            }
        });

        mineralsTable.forEach((row, index) => {
            if (index != 0 && targetMinerals.map(n => n.toLowerCase()).includes(row[0].toLowerCase())) {
                filteredData[row[0]] = row[1].split(" ")[0].replace(',', '');
            }
        });

        console.log(filteredData)
        res.status(200).json(filteredData);
    }catch(error){
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};


// calculate nutrition requirements
const calculateNutritionRequirements = async (characteristics, nutritionPlan) => {
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
        return JSON.stringify(nutritionRequirements.data)
    }catch(error){
        console.log(error)
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
    const items = await FoodNutrition.find();
    res.json(items);
};

// Get Specific Food Nutrition Data
export const getNutrition = async (req, res) => {
    const item = await FoodNutrition.findById(req.params.id);
    if (!item) return res.status(404).json({message: "Item not found"});
    res.json(item);
};