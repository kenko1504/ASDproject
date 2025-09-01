import { useState, useEffect } from "react";
import Settings from "./components/Settings";
import AddIngredient from "./components/DashboardComponent/AddIngredientPopUp"; 
import ItemManagement from "./components/ItemManagement";
import WasteManagement from "./components/WasteManagement";
import Recipes from "./components/Recipes";
import Nutrition from "./components/Nutritions";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Recipes from "./components/Recipes";
import ItemManagement from "./components/ItemManagement";
import Nutrition from "./components/Nutritions";
import WasteBudget from "./components/WasteBudget";
import Settings from "./components/Settings";
import Sidebar from "./components/DashboardComponent/Sidebar.jsx";
import FridgeList from "./components/FridgeList.jsx";

export default function App() {
    return (
        <div className="layout">
            <Sidebar />
            <main className="content">
                <Routes>
                    {/*<Route path="/" element={<Login />} />*/}
                    <Route path="/" element={<Dashboard/>} />
                    <Route path="/fridge" element={<FridgeList />} />
                    <Route path="/item-management" element={<ItemManagement/>} />
                    <Route path="/nutrition" element={<Nutrition />} />
                    <Route path="/waste-budget" element={<WasteBudget />} />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </main>
        </div>
    );
}
