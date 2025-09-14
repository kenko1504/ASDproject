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
            <div className="justify-center text-center items-center">
                <h1 className="text-8xl !mb-10">FridgeManager</h1>
                
                {/* Main CTA button */}
                <button 
                    onClick={openLoginModal}
                    className="text-4xl bg-[#36874D] hover:bg-[#2d6d3e] transition text-white !p-2 !pl-12 !pr-12 rounded-full drop-shadow-lg drop-shadow-gray-400 mb-6"
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