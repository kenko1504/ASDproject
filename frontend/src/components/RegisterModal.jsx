import React, { useState } from "react";

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({ username: "", email: "", password: "" });
    setError("");
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
        
        <h2 className="title text-bold text-4xl mb-6">Register</h2>
        
        {/* Show success message if registration is successful */}
        {success ? (
          <div className="text-center">
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              <p className="font-medium">Registration successful!</p>
              <p className="text-sm mt-1">You can now log in with your credentials.</p>
            </div>
            <button
              onClick={onSwitchToLogin}
              className="w-full bg-[#85BC59] hover:bg-[#6FAF4B] transition text-white px-4 py-3 rounded-lg font-medium"
            >
              Go to Login
            </button>
          </div>
        ) : (
          // Show form only if not registered yet
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#85BC59]"
              />
              
              <input
                name="email"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#85BC59]"
              />
              
              <input
                name="password"
                placeholder="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#85BC59]"
              />
              
              <button 
                type="submit" 
                className="w-full bg-[#85BC59] hover:bg-[#6FAF4B] transition text-white px-4 py-3 rounded-lg font-medium"
              >
                Register
              </button>
            </form>
            
            {error && (
              <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={onSwitchToLogin}
                  className="text-[#85BC59] hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}