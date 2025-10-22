import FoodNutrition from '../models/foodNutrition.js';
import GroceryList from '../models/groceryList.js';
import GroceryItem from '../models/groceryItem.js';

export const searchByQuery = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: "Query parameter is required" });
        }

        const queryObject = JSON.parse(query);
        const searchCriteria = {};

        // Build search criteria
        if (queryObject.searchTerm) {
            searchCriteria.foodName = { $regex: queryObject.searchTerm, $options: "i" };
        }
        if (queryObject.foodType && queryObject.foodType !== "Any") {
            searchCriteria.type = queryObject.foodType;
        }
        if (queryObject.filters && queryObject.filters.length > 0) {
            queryObject.filters.forEach((filter) => {
                if (filter === "protein") { searchCriteria.protein = { $gte: 10 }; } // High Protein
                if (filter === "carbohydrates") { searchCriteria.carbohydrates = { $lte: 15 }; } // Low Carb
                if (filter === "dietaryFiber") { searchCriteria.dietaryFiber = { $gte: 5 }; } // High Fiber
                if (filter === "fat") { searchCriteria.fat = { $lte: 3 }; } // Low Fat
                if (filter === "sugar") { searchCriteria.sugar = { $lte: 5 }; } // Low Sugar
                if (filter === "calories") { searchCriteria.calories = { $lte: 200 }; } // Low Calorie
                if (filter === "iron") { searchCriteria.iron = { $gte: 8 }; } // High Iron
                if (filter === "calcium") { searchCriteria.calcium = { $gte: 200 }; } // High Calcium
                if (filter === "sodium") { searchCriteria.sodium = { $lte: 120 }; } // Low Sodium
                if (filter === "cholesterol") { searchCriteria.cholesterol = { $lte: 20 }; } // Low Cholesterol
                if (filter === "vitaminC") { searchCriteria.vitaminC = { $gte: 30 }; } // Vitamin C Rich
            });
        }

        // Query the database with sorting based on selected filters
        let sortCriteria = {};
        if (queryObject.filters && queryObject.filters.length > 0) {
            const firstFilter = queryObject.filters[0];
            if (firstFilter === "protein") { sortCriteria.protein = -1; } // High protein first
            else if (firstFilter === "carbohydrates") { sortCriteria.carbohydrates = 1; } // Low carb first
            else if (firstFilter === "dietaryFiber") { sortCriteria.dietaryFiber = -1; } // High fiber first
            else if (firstFilter === "fat") { sortCriteria.fat = 1; } // Low fat first
            else if (firstFilter === "sugar") { sortCriteria.sugar = 1; } // Low sugar first
            else if (firstFilter === "calories") { sortCriteria.calories = 1; } // Low calorie first
            else if (firstFilter === "iron") { sortCriteria.iron = -1; } // High iron first
            else if (firstFilter === "calcium") { sortCriteria.calcium = -1; } // High calcium first
            else if (firstFilter === "sodium") { sortCriteria.sodium = 1; } // Low sodium first
            else if (firstFilter === "cholesterol") { sortCriteria.cholesterol = 1; } // Low cholesterol first
            else if (firstFilter === "vitaminC") { sortCriteria.vitaminC = -1; } // High vitamin C first
        }

        const results = await FoodNutrition.find(searchCriteria).sort(sortCriteria);
        // console.log("Search results:", results);
        return res.status(200).json({ results });
    } catch (error) {
        console.error("Error occurred while searching:", error);
        return res.status(500).json({ error: "An error occurred while searching" });
    }
};

export const addToLatestGroceryList = async (req, res) => {
    try {
        const { uid } = req.params;
        const food = req.body.food;
        console.log(food, uid);
        if (!food) {
            return res.status(400).json({ error: "Food does not exist" });
        }
        if (!uid) {
            return res.status(400).json({ error: "User ID does not exist" });
        }
        const list = await GroceryList.findOne({ user: uid }).sort({ date: 1 });
        console.log("Found grocery list:", list);
        if (!list) {
            return res.status(404).json({ error: "Grocery list not found" });
        }
        console.log("Latest grocery list:", list);
        const item = new GroceryItem({ name: `⭐ ${food.foodName}`, quantity: 1, category: food.type, groceryList: list._id });
        await item.save();
        console.log("Item saved:", item);
        return res.status(200).json({ message: "Recommendation added to grocery list" });
    } catch (error) {
        console.error("Error occurred while adding recommendation:", error);
        return res.status(500).json({ error: "An error occurred while adding recommendation" });
    }
};

export const getListByNutritions = async(req, res) => {
    const lackNutrition = req.body

    if(lackNutrition.calories == 0 && lackNutrition.protein == 0 && lackNutrition.carbohydrates == 0 && lackNutrition.sodium == 0 && lackNutrition.fat == 0){
        return res.status(200).json({message: "You reached to the nutrition goal today!"})
    }
    try{
        if(lackNutrition){
            const [proteinList, caloriesList, fatList, sodiumList, carbList] = await Promise.all([
                FoodNutrition.find({
                    protein: { $lte: lackNutrition.protein }
                }).sort({ protein: -1 }).limit(20).lean(),
                
                FoodNutrition.find({
                    energy: { $lte: lackNutrition.calories }
                }).sort({ calories: -1 }).limit(20).lean(),
                
                FoodNutrition.find({
                    fat: { $lte: lackNutrition.fat }
                }).sort({ fat: -1 }).limit(20).lean(),
                
                FoodNutrition.find({
                    sodium: { $lte: lackNutrition.sodium }
                }).sort({ sodium: -1 }).limit(20).lean(),
                
                FoodNutrition.find({
                    carbohydrates: { $lte: lackNutrition.carbohydrates }
                }).sort({ carbohydrates: -1 }).limit(20).lean()
            ]);
            console.log(proteinList, caloriesList)

            return res.status(200).json({
                caloriesList: caloriesList,
                proteinList: proteinList,
                sodiumList: sodiumList,
                carbList: carbList,
                fatList: fatList
            })
        }else{
            return res.status(400).json({error: "Error retrieving Nutrition Data"})
        }
    }catch(error){
        console.log(error)
        throw error
    }
    

}
