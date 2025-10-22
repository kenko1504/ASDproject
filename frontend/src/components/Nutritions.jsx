import { useState, useEffect, useContext } from "react";
import NutritionGraph from "./NutritionGraph";
import MealCard from "./MealCard";
import { AuthContext } from "../contexts/AuthContext";
import Meal from "../../../backend/models/meal";

export default function Nutritions() {
  const { user } = useContext(AuthContext);
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    async function fetchMeals() {
      try {
        console.log("useEffectUser", user)
        const response = await fetch(`http://localhost:5000/meal/${user._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    }
    fetchMeals();
  }, []);

  const handleMealDeleted = (deletedMealId) => {
    setMeals(prevMeals => prevMeals.filter(m => m._id !== deletedMealId))
  }

  return (
    <div>
      <div className="header flex">
        <span className="title font-bold text-2xl">Nutritions</span>
      </div>

      <div className="nutritionGraph">
        <h2 className="title text-xl font-bold">Daily Nutritients Status</h2>
        <NutritionGraph />
      </div>

      <div className="meals">
        <h2 className="title text-xl font-bold">Your Meals Today</h2>
        {meals.length > 0 ? meals.map((meal) => (
          <div key={meal._id} className="meal-card p-4 my-2 rounded-lg">
            <h3 className="meal-type font-semibold">{meal.mealType}</h3>
            <MealCard className="w-full h-full" Meal={meal} onMealDeleted={handleMealDeleted} isDashboard={false} />
          </div>
        )) : (
          <div className="no-meals text-gray-500">No meals found for today.</div>
        )}
      </div>
    </div>
  );
}
