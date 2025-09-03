    import {Link} from "react-router-dom";
    import "../../index.css";
    import logoImg from "../../assets/LogoIcon.png"
    import signOut from "../../assets/SignOut.svg"
    import sampleProfileImg from "../../assets/SampleProfilePic.jpg"
    import settingImg from "../../assets/Settings.svg"
    import notificationImg from "../../assets/Notification.svg"

    export default function Sidebar(){
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
                <div className={"sidebar-footer !mt-auto"}>
                    <div className="upper flex">
                        <button className="flex w-3/12 items-center"><img className="w-12 h-12" src={notificationImg} alt={"Notifications"}/></button><br/>
                        <button className="flex w-9/12 items-center"><img className="w-12 h-12" src={settingImg} alt={"Settings"}/><span className="font-bold text-white">Settings</span></button><br/>
                   </div>
                    <div className="lower flex">
                        <button className="flex w-3/12 items-center"><img className="w-12 h-12" src={signOut} alt={"Sign Out"}/></button>
                        {/*<button className="flex w-9/12 items-center"><img className="w-12 h-12 rounded-[50%]" src={sampleProfileImg} alt={"ProfilePic"}/><span className="font-bold text-white">Login</span></button><br/>*/}
                        <Link className="flex w-9/12 items-center align-middle hover:bg-[#6FAF4B]" to={"/Login"}><p className="font-bold text-white text-center">Login</p></Link>
                    </div>
                </div>
            </div>
        )
    }

