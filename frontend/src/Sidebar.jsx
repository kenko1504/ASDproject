import {Link} from "react-router-dom";
import "./index.css";

export default function Sidebar(){
    return (
        <div className={"sidebar"}>
            <h2 className={"title"}>FridgeManager</h2>

            <nav>
                <Link to={""}>Your Fridge</Link><br/>
                <Link to={""}>Nutrition</Link><br/>
                <Link to={"/waste-budget"}>Waste and Budget Control</Link><br/>
                <Link to={""}>Your Recipes</Link><br/>
            </nav>
            <div className={"sidebar-footer"}>
                <button>Notifications</button><br/>
                <button>Settings</button><br/>
                <button>Name</button><br/>
                <button>Exit</button>
            </div>
        </div>
    )
}