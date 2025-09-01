    import {Link} from "react-router-dom";
    import "../../index.css";

    export default function Sidebar(){
        return (
            <div className={"sidebar w-[200px] flex flex-col bg-[#6abf69] p-5 min-h-screen"}>
                <div className="logo text-center text-xl mb-6">
                    <svg>{/* Logo Icon Here*/}</svg>
                    <span className={"title text-white weight-bold text-center"}><Link to="/">FridgeManager</Link></span>
                </div>
                <nav className="flex flex-grow flex-col">
                    <ul className="m-10 text-white font-bold text-center">
                        <li className="h-12 flex items-center justify-center"><Link to={"/fridge"}>Your Fridge</Link></li>
                        <li className="h-12 flex items-center justify-center"><Link to={"/item-management"}>Item Management</Link></li>
                        <li className="h-12 flex items-center justify-center"><Link to={"/nutrition"}>Nutrition</Link></li>
                        <li className="h-12 flex items-center justify-center"><Link to={"/wasteBudget"}>Waste and Budget Control</Link></li>
                    </ul>
                </nav>
                <div className={"sidebar-footer mt-auto"}>
                    <button><svg></svg>{/*Notifications*/}</button><br/>
                    <button><svg></svg>Settings</button><br/>
                    <button><img src={"#"} alt={"ProfilePic"}/><span>{/*User Name*/}</span></button><br/>
                    <button><svg></svg>{/*Sign Out*/}</button>
                    </div>
            </div>
        )
    }