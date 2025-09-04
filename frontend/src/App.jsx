import AddIngredient from "./components/DashboardComponent/AddIngredientPopUp";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from "./components/Login";
import Register from "./components/Register.jsx";
import Dashboard from "./components/Dashboard";
import Recipes from "./components/Recipes";
import ItemManagement from "./components/ItemManagement";
import Nutrition from "./components/Nutritions";
import WasteBudget from "./components/WasteBudget";
import Settings from "./components/Settings";
import Sidebar from "./components/DashboardComponent/Sidebar.jsx";
import FridgeList from "./components/FridgeList.jsx";
import GroceryList from "./components/GroceryList.jsx";
import "./index.css";

export default function App() {
    return (
        <div className="layout flex">
            <Sidebar />
            <main className="content flex flex-grow !p-4 !m-4 !mt-0 bg-[#f9fff9]">
                <Routes>
                    {/*<Route path="/" element={<Login />} />*/}
                    <Route path="/" element={<Dashboard/>} />
                    <Route path="/fridge" element={<FridgeList />} />
                    <Route path="/item-management/*" element={<ItemManagement/>} />
                    <Route path="/nutrition" element={<Nutrition />} />
                    <Route path="/grocery-list" element={<GroceryList />} />
                    <Route path="/waste-budget" element={<WasteBudget />} />
                    <Route path="/wasteBudget" element={<WasteBudget />} />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Register" element={<Register />} />
                </Routes>
            </main>
        </div>
    );
}
