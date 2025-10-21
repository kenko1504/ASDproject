import React, { useState } from "react";
import { API_BASE_URL } from '../utils/api.js';

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
  const [authToken, setAuthToken] = useState(null);
  const [totpSecret, setTotpSecret] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [totpVerificationCode, setTotpVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [totpSetupStep, setTotpSetupStep] = useState("choice"); // "choice", "qr", "verify", "backup"

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }
      // Store token for TOTP setup
      setAuthToken(data.token);
      // Move to step 3 (2FA setup choice)
      setCurrentStep(3);
    } catch (err) {
      setError(err.message);
    }
  };


  const handleContinue = () => {
    setCurrentStep(2);
    setError("");
  };

  const handleBack = () => {
    if (currentStep === 3 && totpSetupStep !== "choice") {
      // If in TOTP setup flow, go back to choice screen
      setTotpSetupStep("choice");
      setError("");
    } else {
      setCurrentStep(1);
      setError("");
    }
  };

  const handleSetup2FA = async () => {
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/totp/setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "TOTP setup failed");
      }
      setTotpSecret(data.secret);
      setQrCode(data.qrCode);
      setTotpSetupStep("qr");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyTOTP = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/totp/enable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          token: totpVerificationCode,
          secret: totpSecret,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "TOTP verification failed");
      }
      setBackupCodes(data.backupCodes);
      setTotpSetupStep("backup");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSkip2FA = () => {
    setSuccess(true);
  };

  const handleFinish2FA = () => {
    setSuccess(true);
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
    setAuthToken(null);
    setTotpSecret("");
    setQrCode("");
    setTotpVerificationCode("");
    setBackupCodes([]);
    setTotpSetupStep("choice");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
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
            <div className="!mb-4 !p-4 border-3 bg-[#E5F3DA] border-[#A6C78A] rounded-lg border-dashed">
              <p>Registration successful!</p>
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
            ) : currentStep === 2 ? (
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
                    Continue
                  </button>
                </div>
              </form>
            ) : (
              // Step 3: 2FA Setup
              <>
                {totpSetupStep === "choice" && (
                  <div className="space-y-4">
                    <p className="text-gray-600 !mb-6">
                      Setup Two-Factor Authentication
                    </p>
                    <button
                      onClick={handleSetup2FA}
                      className="w-full bg-[#85BC59] hover:bg-[#6FAF4B] transition text-white !px-4 !mb-4 !py-3 rounded-full font-medium"
                    >
                      Set Up 2FA
                    </button>
                    <button
                      onClick={handleSkip2FA}
                      className="w-full border-2 border-[#85BC59] transition text-[#85BC59] hover:text-[#6FAF4B] hover:border-[#6FAF4B] hover:font-semibold !px-4 !py-3 rounded-full font-medium"
                    >
                      No Thanks
                    </button>
                  </div>
                )}

                {totpSetupStep === "qr" && (
                  <div className="space-y-4">
                    <p className="text-gray-600 !mb-4">
                      Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                    </p>
                    <div className="flex justify-center !mb-4">
                      <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                    </div>
                    <div className="text-xs text-gray-500 text-center !mb-4">
                      <p className="!mb-1">Or enter this code manually:</p>
                      <div className="bg-gray-100 !p-3 rounded">
                        <code className="text-xs break-all">{totpSecret}</code>
                      </div>
                    </div>
                    <form onSubmit={handleVerifyTOTP} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Enter 6-digit code"
                        maxLength="6"
                        value={totpVerificationCode}
                        onChange={(e) => setTotpVerificationCode(e.target.value.replace(/\D/g, ''))}
                        required
                        className="w-full !p-2 !mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#85BC59] text-center text-2xl tracking-widest"
                      />
                      <button
                        type="submit"
                        className="w-full !mb-4 bg-[#85BC59] hover:bg-[#6FAF4B] transition text-white !px-4 !py-3 rounded-full font-medium"
                      >
                        Verify & Enable
                      </button>
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="w-1/2 bg-gray-400 hover:bg-gray-500 transition text-white !px-4 !py-3 rounded-full font-medium"
                        >
                          Back
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {totpSetupStep === "backup" && (
                  <div className="space-y-4">
                    <div className="!mb-4 !p-4 border-3 bg-yellow-50 border-yellow-300 rounded-lg border-dashed">
                      <p className="text-yellow-800 font-medium !mb-2">⚠ Save these backup codes!</p>
                      <p className="text-yellow-700 text-sm">
                        Store them safely. You can use these codes if you lose access to your authenticator app.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 !mb-4">
                      {backupCodes.map((code, index) => (
                        <div key={index} className="bg-gray-100 !p-2 rounded text-center font-mono text-sm">
                          {code}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleFinish2FA}
                      className="w-full bg-[#85BC59] hover:bg-[#6FAF4B] transition text-white !px-4 !py-3 rounded-full font-medium"
                    >
                      I've Saved My Backup Codes
                    </button>
                  </div>
                )}
              </>
            )}

            <div className="w-full justify-center flex !mt-4">
              <div className={`rounded-full w-2 h-2 !mr-2 ${currentStep === 1 ? 'bg-gray-400' : 'bg-gray-300'}`}/>
              <div className={`rounded-full w-2 h-2 !mr-2 ${currentStep === 2 ? 'bg-gray-400' : 'bg-gray-300'}`}/>
              <div className={`rounded-full w-2 h-2 ${currentStep === 3 ? 'bg-gray-400' : 'bg-gray-300'}`}/>
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