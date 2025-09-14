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
            <div className={"sidebar w-[250px] flex flex-col bg-[#85BC59] p-5 min-h-screen border-6 rounded-2xl !pt-5 border-white "}>
                <Link to="/"><div className="logo flex font-semibold text-center text-xl !ml-2 !pt-5 !pb-5 content-center items-center group">
                    <img className="w-10 h-10 mx-auto" src={logoImg} alt="logo" />
                    <span className={"title group-hover:text-[#A1CF7B] transition w-8/12 text-white weight-bold text-center text-2xl"}>FridgeManager</span>
                </div></Link>
                <nav className="flex flex-col items-center !mt-5">
                    <ul className=" text-white text-center w-6/7 font-medium">

                        <Link to={"/fridge"}><li 
                            className="h-20 flex items-center justify-center transition hover:bg-[#6FAF4B] bg-[#A1CF7B] rounded-t-xl"
                        >Your Fridge</li></Link>

                        <Link to={"/item-management"}><li 
                            className="h-20 flex items-center justify-center transition hover:bg-[#6FAF4B] bg-[#A1CF7B] border-t-[#85BC59] border-t-6"
                        >Item Management</li></Link>

                        <Link to={"/grocery-list"}><li 
                            className="h-20 flex items-center justify-center transition hover:bg-[#6FAF4B] bg-[#A1CF7B] border-t-[#85BC59] border-t-6"
                        >Grocery List</li></Link>

                        <Link to={"/nutrition"}><li 
                            className="h-20 flex items-center justify-center transition hover:bg-[#6FAF4B] bg-[#A1CF7B] border-t-[#85BC59] border-t-6"
                        >Nutrition</li></Link>

                        <Link to={"/wasteBudget"}><li 
                            className="h-20 flex items-center justify-center transition hover:bg-[#6FAF4B] bg-[#A1CF7B] border-t-[#85BC59] border-t-6 rounded-b-xl"
                        >Waste and <br></br>Budget Control</li></Link>
                    </ul>
                </nav>


                <div className="flex flex-col items-center !mt-20 group"> {/* Notifications */}
                    <ul className=" text-white text-center w-6/7 font-medium border-4 border-[#A1CF7B] rounded-xl">
                        <li className="!p-2 flex items-center justify-center">
                                <img className="w-8 h-8" src={notificationImg} alt={"Notifications"}/>
                        </li> 
                    </ul>
                </div>

                {user ? (
                    <>
                    <div className={"sidebar-footer !mt-auto flex !p-1"}>

                        <div className="flex items-center bg-[#A1CF7B] w-4/6 rounded-xl !pr-2">
                            <img className="w-8 h-8 rounded-[50%] !ml-2" src={sampleProfileImg} alt={"ProfilePic"}/>
                            <span className="font-medium text-white w-full max-w-full text-center overflow-scroll">{user.username}</span>
                        </div>
                        <Link className="flex items-center bg-[#A1CF7B] !pl-1 !pr-1 rounded-xl !ml-1 !mr-1 hover:bg-[#6FAF4B]" to={"/settings"}><img className="w-8 h-8" src={settingImg} alt={"Settings"}/></Link>
                        <button className="flex items-center bg-[#A1CF7B] !p-2  rounded-xl hover:bg-[#6FAF4B]" onClick={handleLogout}><img className="w-6 h-6" src={signOut} alt={"Sign Out"}/></button>
                        

                        {/* <div className="upper flex justify-end !pr-3">
                            <button className="flex items-center bg-[#A1CF7B] !p-2 rounded-xl !mr-2 hover:bg-[#6FAF4B]" onClick={handleLogout}><img className="w-6 h-6" src={signOut} alt={"Sign Out"}/></button>
                            <Link className="flex items-center bg-[#A1CF7B] !pl-1 !pr-1 rounded-xl hover:bg-[#6FAF4B]" to={"/settings"}><img className="w-8 h-8" src={settingImg} alt={"Settings"}/></Link><br/>
                        </div>
                        <div className="lower flex justify-center !mt-2 !mb-2">
                            <button className="flex items-center !p-1 rounded-xl !mr-2 bg-[#A1CF7B] hover:bg-[#6FAF4B]"><img className="w-10 h-10" src={notificationImg} alt={"Notifications"}/></button><br/>                            
                            <div className="flex items-center bg-[#A1CF7B] w-4/6 rounded-xl">
                                <img className="w-10 h-10 rounded-[50%] !ml-2" src={sampleProfileImg} alt={"ProfilePic"}/>
                                <span className="font-medium text-white w-3/5 text-center">{user.username}</span>
                            </div><br/>
                        </div> */}
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

