import { useState, useEffect } from "react";
import AddIngredient from "./components/AddIngredient";
import Header from "./components/Header";
import "./CSS/Dashboard.css";

// entry point
export default function App() {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/ingredients")
      .then(res => res.json())
      .then(data => setIngredients(data))
      .catch(err => console.error(err));
  }, []);

  const handleAdd = (newItem) => {
    setIngredients([...ingredients, newItem]);
  };

  return (
    <>
      <div className="container">
        <div className="sidebar">
          <h1>FridgeManager</h1>
          <button>Your Fridge</button>
          <button>Nutritions</button>
          <button>Waste and Budget Control</button>
          <button>Your Recipes</button>
        </div>

        <div className="dashboard">
          <h2>Dashboard</h2>
          {/* Your dashboard content here */}
        </div>
      </div>
    </>
  );
}
