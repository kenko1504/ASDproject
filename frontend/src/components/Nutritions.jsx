import { useState, useEffect } from "react";
import NutritionGraph from "./NutritionGraph";

export default function Nutritions() {
  const [foodList, setFoodList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/Food");
      const data = await response.json();
      const filteredData = data.filter(item => item.foodName.toLowerCase().includes(searchTerm.toLowerCase()));
      setFoodList(filteredData);
    };
    fetchData();
  }, [searchTerm]);

  return (
    <div>
      <div className="header flex">
        <span className="title font-bold text-2xl">Nutritions</span>
        <input
          type="text"
          placeholder="Search Food..."
          className="!ml-5 bg-gray-100 w-150 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="nutritionGraph">
        <h2 className="title text-xl font-bold">Daily Nutritients Status</h2>
        <NutritionGraph />
      </div>
      
      <div className="nutrition-info !mt-5 h-200 overflow-auto">
        <table>
          <thead>
            <tr>
              <th>Food Name</th>
            </tr>
          </thead>
          <tbody>
            {foodList.map((food) => (
              <tr key={food._id}>
                <td>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedFood(food);
                    }}
                    className="text-blue-600 !underline"
                  >
                    {food.foodName}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedFood && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/[var(--bg-opacity)] [--bg-opacity:50%]">
          <div className="bg-white p-5 rounded-lg shadow-lg w-1/3">
            <h2 className="font-bold text-xl mb-2">{selectedFood.foodName}</h2>
            <p>Calories: {selectedFood.calories}</p>
            <p>Protein: {selectedFood.protein}</p>
            <p>Fat: {selectedFood.fat}</p>
            <p>Carbohydrates: {selectedFood.carbohydrates}</p>
            <p>Sugar: {selectedFood.sugar}</p>
            <p>Fiber: {selectedFood.fiber}</p>
            <p>Cholesterol: {selectedFood.cholesterol}</p>
            <p>Sodium: {selectedFood.sodium}</p>
            <p>Calcium: {selectedFood.calcium}</p>
            <p>Iron: {selectedFood.iron}</p>
            <p>Vitamin C: {selectedFood.vitaminC}</p>
            <button
              onClick={() => setSelectedFood(null)}
              className="mt-4 px-3 py-1 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
