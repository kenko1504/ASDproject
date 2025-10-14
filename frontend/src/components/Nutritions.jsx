import { useState, useEffect } from "react";
import NutritionGraph from "./NutritionGraph";

export default function Nutritions() {
  const [searchTerm, setSearchTerm] = useState("");

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
    </div>
  );
}
