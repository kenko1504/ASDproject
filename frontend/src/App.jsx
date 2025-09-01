import { useState, useEffect } from "react";
import AddIngredient from "./components/AddIngredient";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Recipes from "./components/Recipes";
import ItemManagement from "./components/ItemManagement";
import Nutrition from "./components/Nutritions";
import WasteManagement from "./components/WasteManagement";
import Settings from "./components/Settings";

// entry point
export default function App() {
    return (
        <div className="layout flex min-h-screen">
            <Sidebar />
            <main className="content flex flex-grow p-20 bg-[#f9fff9]">
                <Routes>
                    {/*<Route path="/" element={<Login />} />*/}
                    <Route path="/" element={<Dashboard/>} />
                    <Route path="/fridge" element={<FridgeList />} />
                    <Route path="/item-management" element={<ItemManagement/>} />
                    <Route path="/nutrition" element={<Nutrition />} />
                    <Route path="/wasteBudget" element={<WasteBudget />} />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </main>
        </div>
    );
}
