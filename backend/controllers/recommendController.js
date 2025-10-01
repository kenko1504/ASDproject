import FoodNutrition from '../models/foodNutrition.js'; // Adjust the path as necessary

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
        console.log("Search results:", results);
        return res.status(200).json({ results });
    } catch (error) {
        console.error("Error occurred while searching:", error);
        return res.status(500).json({ error: "An error occurred while searching" });
    }
};
