import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
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

  return (
    <div>
      <h2 className="title text-bold text-4xl">Register</h2><br/>

      {/* Show this only if registration is successful */}
      {success ? (
        <div>
          <p>Registration successful!</p>
          <Link to="/login">Login</Link>
        </div>
      ) : (
        // Show form only if not registered yet
        <form onSubmit={handleSubmit} className="card bg-[#D5FAB8] !p-4 !m-4 !mt-0 rounded-lg">
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <br/>

          <input
            name="email"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <br/>

          <input
            name="password"
            placeholder="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <br/><br/>

          <button type="submit" className="bg-[#85BC59] hover:bg-[#6FAF4B] transition text-white px-3 py-2 rounded">Register</button>
        </form>
      )}

      {error && <p>{error}</p>}
    </div>
  );
}