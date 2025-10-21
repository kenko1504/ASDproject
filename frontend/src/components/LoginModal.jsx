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
  const [showTotpInput, setShowTotpInput] = useState(false);
  const [userId, setUserId] = useState(null);
  const [totpCode, setTotpCode] = useState("");
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

      // Check if TOTP is required
      if (data.totpRequired) {
        setUserId(data.userId);
        setShowTotpInput(true);
        setError("");
        return;
      }

      login(data.user, data.token);
      onClose(); // Close the modal
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTotpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          totpToken: totpCode,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "TOTP verification failed");
      }

      login(data.user, data.token);
      onClose(); // Close the modal
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBackToLogin = () => {
    setShowTotpInput(false);
    setTotpCode("");
    setUserId(null);
    setError("");
  };

  const handleClose = () => {
    // Reset form state when closing
    setFormData({ username: "", password: "" });
    setError("");
    setSuccess("");
    setShowTotpInput(false);
    setTotpCode("");
    setUserId(null);
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    >
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full !mx-4 relative !p-8">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>

        {!showTotpInput ? (
          <>
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
          </>
        ) : (
          <>
            <h2 className="title text-bold text-4xl !mb-6">Two-Factor Authentication</h2>

            <p className="text-gray-600 !mb-6">
              Enter the 6-digit code from your authenticator app
            </p>

            <form onSubmit={handleTotpSubmit} className="space-y-4">
              <input
                name="totpCode"
                placeholder="000000"
                type="text"
                maxLength="6"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                required
                className="w-full !p-2 !mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#85BC59] text-center text-2xl tracking-widest"
              />

              <button
                type="submit"
                className="w-full bg-[#85BC59] hover:bg-[#6FAF4B] transition text-white !px-4 !py-3 !mb-4 rounded-full font-medium"
              >
                Verify & Login
              </button>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-1/2 bg-gray-400 hover:bg-gray-500 transition text-white !px-4 !py-3 rounded-full font-medium"
                >
                  Back
                </button>
              </div>
            </form>

            {error && (
              <p className="text-red-500 text-sm !mt-4 text-center">{error}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}