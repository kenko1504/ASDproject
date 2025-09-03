    import {Link, useNavigate} from "react-router-dom";
    import { useContext } from "react";
    import { AuthContext } from "../../contexts/AuthContext.jsx";

    import "../../index.css";
    import logoImg from "../../assets/LogoIcon.png"
    import signOut from "../../assets/SignOut.svg"
    import sampleProfileImg from "../../assets/SampleProfilePic.jpg"
    import settingImg from "../../assets/Settings.svg"
    import notificationImg from "../../assets/Notification.svg"

    ;

    export default function Sidebar(){
        const { user, logout } = useContext(AuthContext);
        const navigate = useNavigate(); 

        const handleLogout = () => {
            logout();
            navigate("/login");
        }

        return (
            <div className={"sidebar w-[200px] flex flex-col bg-[#85BC59] p-5 min-h-screen"}>
                <div className="logo flex cinzel-decorative-regular text-center text-xl !mt-5 content-center">
                    <img className="w-2/12 h-8 mx-auto" src={logoImg} alt="logo" />
                    <span className={"title w-8/12 text-white weight-bold text-center"}><Link to="/">FridgeManager</Link></span>
                </div>
                <nav className="flex flex-grow flex-col">
                    <ul className="!mt-15 text-white font-bold text-center">
                        <li className="h-15 flex items-center justify-center transition hover:bg-[#6FAF4B]"><Link to={"/fridge"}>Your Fridge</Link></li>
                        <li className="h-15 flex items-center justify-center transition hover:bg-[#6FAF4B]"><Link to={"/item-management"}>Item Management</Link></li>
                        <li className="h-15 flex items-center justify-center transition hover:bg-[#6FAF4B]"><Link to={"/nutrition"}>Nutrition</Link></li>
                        <li className="h-15 flex items-center justify-center transition hover:bg-[#6FAF4B]"><Link to={"/wasteBudget"}>Waste and <br></br>Budget Control</Link></li>
                    </ul>
                </nav>

                {user ? (
                    <>
                    <div className={"sidebar-footer !mt-auto"}>
                        <div className="upper flex">
                            <button className="flex w-3/12 items-center"><img className="w-12 h-12" src={notificationImg} alt={"Notifications"}/></button><br/>
                            <Link className="flex w-9/12 items-center" to={"/settings"}><img className="w-10 h-10" src={settingImg} alt={"Settings"}/><span className="font-bold text-white">Settings</span></Link><br/>
                        </div>
                        <div className="lower flex">
                            <button className="flex w-3/12 items-center" onClick={handleLogout}><img className="w-12 h-12" src={signOut} alt={"Sign Out"}/></button>
                            <button className="flex w-9/12 items-center"><img className="w-10 h-10 rounded-[50%]" src={sampleProfileImg} alt={"ProfilePic"}/><span className="font-bold text-white">{user.username}</span></button><br/>
                        </div>
                    </div>
                    </>
                ) : (
                    <>
                        <Link className="flex items-center align-middle h-10 hover:bg-[#6FAF4B]" to={"/Login"}><p className="font-bold text-white w-full text-center">Login</p></Link>
                        <Link className="flex items-center align-middle h-10 hover:bg-[#6FAF4B]" to={"/Register"}><p className="font-bold text-white w-full text-center">Register</p></Link>
                    </>
                )}

            </div>
        )
    }

