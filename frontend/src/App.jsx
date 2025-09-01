import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import AddIngredient from "./AddIngredient";
import ItemManagement from "./ItemManagement";
import WasteBudget from "./WasteBudget.jsx"
import Dashboard from "./Dashboard.jsx";
import FridgeList from "./FridgeList.jsx";


export default function App() {
    return (
        <div className="layout">
            <Sidebar />
            <main className="content">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/fridge" element={<FridgeList />} />
                    <Route path="/item-management" element={<ItemManagement />} />
                    <Route path="/waste-budget" element={<WasteBudget />} />
                </Routes>
            </main>
        </div>
    );
}

