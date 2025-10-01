import AddIngredient from "./components/DashboardComponent/AddIngredientPopUp.jsx";
import Header from "./components/Header.jsx";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from "./components/Dashboard.jsx";
import Recipes from "./components/Recipes.jsx";
import ItemManagement from "./components/ItemManagement.jsx";
import Nutrition from "./components/Nutritions.jsx";
import WasteBudget from "./components/WasteBudget.jsx";
import Settings from "./components/Settings.jsx";
import Sidebar from "./components/DashboardComponent/Sidebar.jsx";
import FridgeList from "./components/FridgeList.jsx";
import GroceryList from "./components/GroceryList.jsx";
import ViewGroceryList from "./components/ViewGroceryItems.jsx";
import AddRecipe from "./components/AddRecipe.jsx";
import ViewRecipe from "./components/ViewRecipe.jsx";
import EditRecipe from "./components/EditRecipe.jsx";
import AddButton from "./components/DashboardComponent/AddButton";
import Recommendations from "./components/Recommendation.jsx";
import "./index.css";

export default function App() {
    return (
        <div className="layout flex">
            <Sidebar />
            <AddButton />
            <main className="content flex flex-grow !p-4 !m-4 !pt-0 !pb-0 !mb-0 !mt-0 text-[#3A4331]">
                <Routes>
                    {/*<Route path="/" element={<Login />} />*/}
                    <Route path="/" element={<Dashboard/>} />
                    <Route path="/fridge" element={<FridgeList />} />
                    <Route path="/item-management/*" element={<ItemManagement/>} />
                    <Route path="/nutrition" element={<Nutrition />} />
                    <Route path="/grocery-list" element={<GroceryList />} />
                    <Route path="/grocery-list/view/:id" element={<ViewGroceryList />} />
                    <Route path="/recommendations" element={<Recommendations />} />
                    <Route path="/waste-budget" element={<WasteBudget />} />
                    <Route path="/wasteBudget" element={<WasteBudget />} />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/recipe/:recipeId" element={<ViewRecipe />} />
                    <Route path="/editRecipe/:recipeId" element={<EditRecipe />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/addRecipe" element={<AddRecipe />} />
                </Routes>    
            </main>
        </div>
    );
}
