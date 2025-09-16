import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";

export default function LoginModal({ isOpen, onClose, onSwitchToRegister, onReset }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
      login(data.user);
      onClose(); // Close the modal
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClose = () => {
    // Reset form state when closing
    setFormData({ username: "", password: "" });
    setError("");
    setSuccess("");
    if (onReset) onReset();
    onClose();
  };

  const handleSwitchToRegister = () => {
    // Reset form state when switching to register
    setFormData({ username: "", password: "" });
    setError("");
    setSuccess("");
    onSwitchToRegister();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full !mx-4 relative !p-8">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
        
        <h2 className="title text-bold text-4xl !mb-6">Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full !p-2 !mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#85BC59]"
          />
          
          <input
            name="password"
            placeholder="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full !p-2 !mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#85BC59]"
          />
          
          <button 
            type="submit" 
            className="w-full bg-[#85BC59] hover:bg-[#6FAF4B] transition text-white !px-4 !py-3 rounded-full font-medium"
          >
            Login
          </button>
        </form>
        
        {error && (
          <p className="text-red-500 text-sm !mt-4 text-center">{error}</p>
        )}
        
        {success && (
          <p className="text-green-500 text-sm !mt-4 text-center">{success}</p>
        )}
        
        <div className="!mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={handleSwitchToRegister}
              className="text-[#85BC59] hover:text-[#6FAF4B] transition hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}