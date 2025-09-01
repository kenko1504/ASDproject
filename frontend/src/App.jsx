import { useState, useEffect } from "react";
import Settings from "./components/Settings";
import AddIngredient from "./components/AddIngredient"; 
import ItemManagement from "./components/ItemManagement";
import WasteManagement from "./components/WasteManagement";
import Recipes from "./components/Recipes";
import Nutrition from "./components/Nutritions";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// entry point
export default function App() {
  return (
    <>
      <Header />
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/itemManagement" element={<ItemManagement/>} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/wasteManagement" element={<WasteManagement />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}
