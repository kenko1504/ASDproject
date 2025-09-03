import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user, logout, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    confirmUsername: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (field) => {
    let updateData = {};
    let error = "";

    switch (field) {
      case "username":
        if (formData.username !== formData.confirmUsername) {
          error = "Usernames do not match.";
        } else {
          updateData.username = formData.username;
        }
        break;
      case "email":
        if (formData.email !== formData.confirmEmail) {
          error = "Emails do not match.";
        } else {
          updateData.email = formData.email;
        }
        break;
      case "password":
        if (formData.password !== formData.confirmPassword) {
          error = "Passwords do not match.";
        } else {
          updateData.password = formData.password;
        }
        break;
      default:
        return;
    }

    if (error) {
      setMessage(error);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Update failed");
      }

      const updatedUser = await res.json();
      login(updatedUser); // Update context
      setMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully.`);

      setFormData((prev) => ({
        ...prev,
        [`${field}`]: "",
        [`confirm${field.charAt(0).toUpperCase() + field.slice(1)}`]: "",
      }));
    } catch (err) {
      setMessage(err.message);
    }
  };


  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action is permanent.");

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/users/${user._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete account");
      }

      logout();
      navigate("/login");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      
      {/* Username Form */}
      <div className="space-y-2">
        <p className="font-semibold">Current Username: {user.username}</p>
        <div className="flex gap-2">
          <input
            name="username"
            placeholder="New Username"
            className="border p-2 flex-1"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            name="confirmUsername"
            placeholder="Confirm Username"
            className="border p-2 flex-1"
            value={formData.confirmUsername}
            onChange={handleChange}
          />
          <button
            onClick={() => handleUpdate("username")}
            className="bg-[#85BC59] hover:bg-[#6FAF4B] transition text-white px-3 py-2 rounded"
          >
            Update
          </button>
        </div>
      </div><br/>

      {/* Email Form */}
      <div className="space-y-2">
        <p className="font-semibold">Current Email: {user.email}</p>
        <div className="flex gap-2">
          <input
            name="email"
            placeholder="New Email"
            className="border p-2 flex-1"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            name="confirmEmail"
            placeholder="Confirm Email"
            className="border p-2 flex-1"
            value={formData.confirmEmail}
            onChange={handleChange}
          />
          <button
            onClick={() => handleUpdate("email")}
            className="bg-[#85BC59] hover:bg-[#6FAF4B] transition text-white px-3 py-2 rounded"
          >
            Update
          </button>
        </div>
      </div><br/>

      {/* Password Form */}
      <div className="space-y-2">
        <p className="font-semibold">Change Password</p>
        <div className="flex gap-2">
          <input
            type="password"
            name="password"
            placeholder="New Password"
            className="border p-2 flex-1"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="border p-2 flex-1"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button
            onClick={() => handleUpdate("password")}
            className="bg-[#85BC59] hover:bg-[#6FAF4B] transition text-white px-3 py-2 rounded"
          >
            Update
          </button>
        </div>
      </div>

      {/* Feedback */}
      {message && <p className="font-medium">{message}</p>}

      <br/>
      
      <button onClick={handleDeleteAccount} className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-700 transition">
        Delete Account
      </button>
    </div>
  );
}
