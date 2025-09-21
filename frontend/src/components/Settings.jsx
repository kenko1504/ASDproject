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
    <div>
      
      <div className="!pt-5 flex w-full relative">
        <span className="title font-semibold text-4xl">Settings</span> <br/>
        <button onClick={handleDeleteAccount} className="bg-red-400 text-white !p-4 !m-4 !mt-0 rounded-lg hover:bg-red-700 transition absolute top-4 right-0">
          Delete Account
        </button>
      </div>

      <div className="flex !pt-10">
        {/* Username Form */}
        <div className="card w-1/3 bg-[#D5FAB8] !p-4 !m-4 !mt-0 rounded-lg">
          <div className="flex font-semibold !mb-4">
            <p className="min-w-1/3">Current Username:</p>
            <p className="overflow-x-auto">{user.username}</p>
          </div>
          <div className="gap-2">
            <input
              name="username"
              placeholder="New Username"
              className="border border-[#85BC59] rounded-lg !mb-4 !p-2 flex-1 w-full focus:outline-1 outline-[#6FAF4B]"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              name="confirmUsername"
              placeholder="Confirm Username"
              className="border border-[#85BC59] rounded-lg !mb-4 !p-2 flex-1 w-full focus:outline-1 outline-[#6FAF4B]"
              value={formData.confirmUsername}
              onChange={handleChange}
            /> <br/>
            <button
              onClick={() => handleUpdate("username")}
              className="bg-[#85BC59] hover:bg-[#6FAF4B] transition text-white !px-3 !py-2 rounded-full w-full"
            >
              Update
            </button>
          </div>
        </div>

        {/* Email Form */}
        <div className="card w-1/3 bg-[#D5FAB8] !p-4 !m-4 !mt-0 rounded-lg">
          <div className="flex font-semibold !mb-4">
            <p className="min-w-1/4">Current email:</p>
            <p className="overflow-x-auto">{user.email}</p>
          </div> 
          <div className="gap-2">
            <input
              name="email"
              placeholder="New Email"
              className="border border-[#85BC59] rounded-lg !mb-4 !p-2 flex-1 w-full focus:outline-1 outline-[#6FAF4B]"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="confirmEmail"
              placeholder="Confirm Email"
              className="border border-[#85BC59] rounded-lg !mb-4 !p-2 flex-1 w-full focus:outline-1 outline-[#6FAF4B]"
              value={formData.confirmEmail}
              onChange={handleChange}
            />
            <button
              onClick={() => handleUpdate("email")}
              className="bg-[#85BC59] hover:bg-[#6FAF4B] transition text-white !px-3 !py-2 rounded-full w-full"
            >
              Update
            </button>
          </div>
        </div>

        {/* Password Form */}
        <div className="card bg-[#D5FAB8] !p-4 !m-4 !mt-0 rounded-lg w-1/3">
          <p className="font-semibold !mb-4">Change Password</p>
          <div className="gap-2">
            <input
              type="password"
              name="password"
              placeholder="New Password"
              className="border border-[#85BC59] rounded-lg !mb-4 !p-2 flex-1 w-full focus:outline-1 outline-[#6FAF4B]"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="border border-[#85BC59] rounded-lg !mb-4 !p-2 flex-1 w-full focus:outline-1 outline-[#6FAF4B]"
              value={formData.confirmPassword}
              onChange={handleChange}
            /> <br/>
            <button
              onClick={() => handleUpdate("password")}
              className="bg-[#85BC59] hover:bg-[#6FAF4B] transition text-white !px-3 !py-2 rounded-full w-full"
            >
              Update
            </button>
          </div>
        </div>

        
      </div> 
      {/* Feedback */}
      {message && <p className="!ml-4 !p-2 border-dashed border-2 w-fit border-green-600 bg-green-200 rounded font-medium">{message}</p>} 
      <br/>
    </div>
  );
}
