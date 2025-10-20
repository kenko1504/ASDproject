import {Routes, Route} from 'react-router-dom';
import {AuthContext} from './contexts/AuthContext';
import {useContext} from "react";
import LandingPage from "./components/LandingPage.jsx";
import MainApp from "./MainApp.jsx";
import "./index.css";
import FridgeManagement from "./components/FridgeManagement.jsx";

export default function App() {
    const {user} = useContext(AuthContext);

    return (
        <Routes>
            <Route
                path="/*"
                element={user ? <MainApp/> : <LandingPage/>}
            />
            <Route
                path={"/item-management/*"}
                element={<FridgeManagement/>}
            />
        </Routes>
    );
}