import React, { useState } from "react";

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
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
      handleClose();
    }
  };

  const handleContinue = () => {
    setCurrentStep(2);
    setError("");
  };

  const handleBack = () => {
    setCurrentStep(1);
    setError("");
  };

  const handleSwitchToLogin = () => {
    // Reset form state when switching to login
    setFormData({ username: "", email: "", password: "", gender: "", age: "", height: "", weight: "" });
    setCurrentStep(1);
    setError("");
    setSuccess(false);
    onSwitchToLogin();
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({ username: "", email: "", password: "", gender: "", age: "", height: "", weight: "" });
    setCurrentStep(1);
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
      <div className="bg-white !p-8 rounded-xl shadow-lg max-w-md w-full !mx-4 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
        
        <h2 className="title text-bold text-4xl !mb-6">Register</h2>
        
        {/* Show success message if registration is successful */}
        {success ? (
          <div className="text-center">
            <div className="!mb-4 !p-4 bg-green-100 border-2 border-green-400 text-green-700 rounded border-dashed">
              <p className="font-medium">Registration successful!</p>
            </div>
            <button
              onClick={handleSwitchToLogin}
              className="w-full bg-[#85BC59] hover:bg-[#6FAF4B] transition text-white !px-4 !py-3 rounded-lg font-medium"
            >
              Go to Login
            </button>
          </div>
        ) : (
          // Show form only if not registered yet
          <>
            {currentStep === 1 ? (
              <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-4">
                <input
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full !p-2 !mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#85BC59]"
                />

                <input
                  name="email"
                  placeholder="Email"
                  type="email"
                  value={formData.email}
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
                  Continue
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full !p-2 !mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#85BC59]"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>

                <input
                  name="age"
                  placeholder="Age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (isNaN(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                      e.preventDefault();
                    }
                  }}
                  required
                  min="1"
                  max="120"
                  className="w-full !p-2 !mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#85BC59]"
                />

                <input
                  name="height"
                  placeholder="Height (cm)"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  min="1"
                  max="300"
                  className="w-full !p-2 !mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#85BC59]"
                />

                <input
                  name="weight"
                  placeholder="Weight (kg)"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  min="1"
                  max="500"
                  className="w-full !p-2 !mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#85BC59]"
                />

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-1/4 !mr-4 bg-gray-400 hover:bg-gray-500 transition text-white rounded-full font-medium"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-3/4 bg-[#85BC59] hover:bg-[#6FAF4B] transition text-white !px-4 !py-3 rounded-full font-medium"
                  >
                    Register
                  </button>
                </div>
              </form>
            )}

            <div className="w-full justify-center flex !mt-4">
              <div className={`rounded-full w-2 h-2 !mr-2 ${currentStep === 1 ? 'bg-gray-400' : 'bg-gray-300'}`}/>
              <div className={`rounded-full w-2 h-2 ${currentStep === 2 ? 'bg-gray-400' : 'bg-gray-300'}`}/>
            </div>
            
            {error && (
              <p className="text-red-500 text-sm !mt-2 text-center">{error}</p>
            )}
            
            <div className="!mt-4 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={handleSwitchToLogin}
                  className="text-[#85BC59] hover:text-[#6FAF4B] transition hover:underline font-medium"
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