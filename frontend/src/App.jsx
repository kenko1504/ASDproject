import { useState, useEffect } from "react";
import AddIngredient from "./components/AddIngredient";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

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
      <Header />
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard ingredients={ingredients} />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/itemManagement" element={<ItemManagement ingredients={ingredients} />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/wasteManagement" element={<WasteManagement />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}
