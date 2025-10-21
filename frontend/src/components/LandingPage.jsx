import React, { useState } from "react";
import LoginModal from "./LoginModal.jsx";
import RegisterModal from "./RegisterModal.jsx";
import "../index.css";

export default function LandingPage() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
        setIsRegisterModalOpen(false); // Close register modal if open
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    const openRegisterModal = () => {
        setIsRegisterModalOpen(true);
        setIsLoginModalOpen(false); // Close login modal if open
    };

    const closeRegisterModal = () => {
        setIsRegisterModalOpen(false);
    };

    const switchToRegister = () => {
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(true);
    };

    const switchToLogin = () => {
        setIsRegisterModalOpen(false);
        setIsLoginModalOpen(true);
    };

    return (
        <div className="h-screen justify-center items-center flex">
            <div className="justify-center text-center items-center bg-[#E5F3DA] border-[#A6C78A] !py-30 !px-60 rounded-4xl border-dashed border-12">
                <h1 className="text-8xl !mb-10 font-bold text-[#3A4331]">FridgeManager</h1>
                
                <button 
                    onClick={openLoginModal}
                    className="text-4xl hover:bg-[#6FAF4B] bg-[#85BC59] transition text-white !px-24 !py-2 rounded-full hover:drop-shadow-xl transform hover:scale-105 drop-shadow-gray-400 mb-6"
                >
                    Get Started
                </button>
            </div>
            
            <LoginModal 
                isOpen={isLoginModalOpen} 
                onClose={closeLoginModal}
                onSwitchToRegister={switchToRegister}
            />
            
            <RegisterModal 
                isOpen={isRegisterModalOpen} 
                onClose={closeRegisterModal}
                onSwitchToLogin={switchToLogin}
            />
        </div>
    );
}