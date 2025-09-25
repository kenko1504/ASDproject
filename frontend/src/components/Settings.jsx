import { useContext, useState, useEffect } from "react";
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
    gender: "",
    age: "",
    height: "",
    weight: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user && user.characteristics) {
      setFormData(prev => ({
        ...prev,
        gender: user.characteristics.gender || "",
        age: user.characteristics.age || "",
        height: user.characteristics.height || "",
        weight: user.characteristics.weight || "",
      }));
    }
  }, [user]);

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
      case "characteristics":
        updateData.characteristics = {
          gender: formData.gender,
          age: parseInt(formData.age),
          height: parseInt(formData.height),
          weight: parseInt(formData.weight),
        };
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

      if (field === "characteristics") {
        setFormData((prev) => ({
          ...prev,
          gender: "",
          age: "",
          height: "",
          weight: "",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [`${field}`]: "",
          [`confirm${field.charAt(0).toUpperCase() + field.slice(1)}`]: "",
        }));
      }
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
    <div className="w-full">
      
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

      {/* Characteristics Section */}
      <div className="flex !pt-10">
        <div className="card w-full bg-[#D5FAB8] !p-4 !m-4 !mt-0 rounded-lg">
          <p className="font-semibold !mb-4 text-xl">Update Characteristics</p>
          <div className="flex font-semibold !mb-4 gap-4">
            <div className="flex-1">
              <p>Current Gender: {user.characteristics?.gender || "Not set"}</p>
            </div>
            <div className="flex-1">
              <p>Current Age: {user.characteristics?.age || "Not set"}</p>
            </div>
            <div className="flex-1">
              <p>Current Height: {user.characteristics?.height ? `${user.characteristics.height} cm` : "Not set"}</p>
            </div>
            <div className="flex-1">
              <p>Current Weight: {user.characteristics?.weight ? `${user.characteristics.weight} kg` : "Not set"}</p>
            </div>
          </div>
          <div className="flex gap-4 !mb-4">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border border-[#85BC59] rounded-lg !p-2 flex-1 focus:outline-1 outline-[#6FAF4B]"
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
              min="1"
              max="120"
              step="1"
              className="border border-[#85BC59] rounded-lg !p-2 flex-1 focus:outline-1 outline-[#6FAF4B]"
            />
            <input
              name="height"
              placeholder="Height (cm)"
              type="number"
              value={formData.height}
              onChange={handleChange}
              min="1"
              max="300"
              className="border border-[#85BC59] rounded-lg !p-2 flex-1 focus:outline-1 outline-[#6FAF4B]"
            />
            <input
              name="weight"
              placeholder="Weight (kg)"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              min="1"
              max="500"
              className="border border-[#85BC59] rounded-lg !p-2 flex-1 focus:outline-1 outline-[#6FAF4B]"
            />
          </div>
          <div className="w-full flex justify-center">
            <button className="bg-[#85BC59] hover:bg-[#6FAF4B] transition text-white !px-4 !py-2 rounded-full w-1/3"
              onClick={() => handleUpdate("characteristics")}
            >
              Update Characteristics
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
