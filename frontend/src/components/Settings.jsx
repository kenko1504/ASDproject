import { useContext, useState, useEffect } from "react";
import { AuthContext, getUserRoleFromToken } from "../contexts/AuthContext.jsx";
import { authenticatedFetch } from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import searchImg from "../assets/search-svgrepo-com.svg";
import editImg from "../assets/edit-svgrepo-com.svg";
import trashImg from "../assets/trash-alt-svgrepo-com.svg";
import checkImg from "../assets/circle-check-svgrepo-com.svg";
import crossImg from "../assets/circle-xmark-svgrepo-com.svg";

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

  // Admin user search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("username"); // "username" or "email"
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // User editing state
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    role: "user"
  });

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

  // Fetch users from backend (admin only)
  const fetchUsers = async () => {
    if (getUserRoleFromToken() !== "admin") return;

    setIsSearching(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) {
        queryParams.append("searchTerm", searchTerm);
        queryParams.append("searchType", searchType);
      }

      const response = await authenticatedFetch(`http://localhost:5000/users/search?${queryParams}`);
      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
        setFilteredUsers(userData);
      } else {
        console.error('Failed to fetch users');
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setFilteredUsers([]);
    }
    setIsSearching(false);
  };

  // Load all users on component mount for admin
  useEffect(() => {
    if (getUserRoleFromToken() === "admin") {
      fetchUsers();
    }
  }, []);

  // Search users when search term or type changes
  useEffect(() => {
    if (getUserRoleFromToken() === "admin") {
      // Cancel any current editing when search changes
      if (editingUserId) {
        cancelEditingUser();
      }

      const timeoutId = setTimeout(() => {
        fetchUsers();
      }, 300); // Debounce search

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, searchType]);

  const handleSearchTypeToggle = (type) => {
    setSearchType(type);
  };

  // User management functions
  const startEditingUser = (userData) => {
    setEditingUserId(userData._id);
    setEditFormData({
      username: userData.username,
      email: userData.email,
      role: userData.role
    });
  };

  const cancelEditingUser = () => {
    setEditingUserId(null);
    setEditFormData({ username: "", email: "", role: "user" });
  };

  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveUserChanges = async () => {
    if (!editingUserId) return;

    try {
      // Use admin endpoint for user updates (includes role changes)
      const response = await authenticatedFetch(`http://localhost:5000/users/${editingUserId}/admin`, {
        method: 'PUT',
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        const updatedUser = await response.json();

        // Update the user in the lists
        setUsers(prev => prev.map(u => u._id === editingUserId ? updatedUser : u));
        setFilteredUsers(prev => prev.map(u => u._id === editingUserId ? updatedUser : u));

        setMessage("User updated successfully");
        cancelEditingUser();
      } else {
        const error = await response.json();
        setMessage(`Error updating user: ${error.error || 'Update failed'}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage('Error updating user');
    }
  };

  const deleteUser = async (userId, username) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      const response = await authenticatedFetch(`http://localhost:5000/users/${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove user from the lists
        setUsers(prev => prev.filter(u => u._id !== userId));
        setFilteredUsers(prev => prev.filter(u => u._id !== userId));

        setMessage(`User "${username}" deleted successfully`);

        // Cancel editing if the deleted user was being edited
        if (editingUserId === userId) {
          cancelEditingUser();
        }
      } else {
        const error = await response.json();
        setMessage(`Error deleting user: ${error.error || 'Delete failed'}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage('Error deleting user');
    }
  };

  return (
    <div className="w-full max-h-screen">
      
      <div className="!pt-5 !mb-6 flex items-center w-full relative">
        <span className="title font-semibold text-4xl">Settings</span>
        {message && <p className="!ml-4 !px-8 !py-1 border-dashed w-fit border-3 bg-[#E5F3DA] border-[#A6C78A] rounded-lg">{message}</p>}        
        <button onClick={handleDeleteAccount} className="bg-red-400  !p-4 !m-4 !mt-0 rounded-lg hover:bg-red-700 transition absolute top-4 right-0">
          Delete Account
        </button>
      </div>

      <div className="overflow-auto h-11/12">
      <div className="flex">
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
              className="border-2 border-[#A6C78A] rounded-lg !mb-4 !p-2 flex-1 w-full focus:outline-1 outline-[#95B574]"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              name="confirmUsername"
              placeholder="Confirm Username"
              className="border-2 border-[#A6C78A] rounded-lg !mb-4 !p-2 flex-1 w-full focus:outline-1 outline-[#95B574]"
              value={formData.confirmUsername}
              onChange={handleChange}
            /> <br/>
            <button
              onClick={() => handleUpdate("username")}
              className="bg-[#A6C78A] hover:bg-[#95B574] transition  !px-3 !py-2 rounded-full w-full"
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
              className="border-2 border-[#A6C78A] rounded-lg !mb-4 !p-2 flex-1 w-full focus:outline-1 outline-[#95B574]"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="confirmEmail"
              placeholder="Confirm Email"
              className="border-2 border-[#A6C78A] rounded-lg !mb-4 !p-2 flex-1 w-full focus:outline-1 outline-[#95B574]"
              value={formData.confirmEmail}
              onChange={handleChange}
            />
            <button
              onClick={() => handleUpdate("email")}
              className="bg-[#A6C78A] hover:bg-[#95B574] transition  !px-3 !py-2 rounded-full w-full"
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
              className="border-2 border-[#A6C78A] rounded-lg !mb-4 !p-2 flex-1 w-full focus:outline-1 outline-[#95B574]"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="border-2 border-[#A6C78A] rounded-lg !mb-4 !p-2 flex-1 w-full focus:outline-1 outline-[#95B574]"
              value={formData.confirmPassword}
              onChange={handleChange}
            /> <br/>
            <button
              onClick={() => handleUpdate("password")}
              className="bg-[#A6C78A] hover:bg-[#95B574] transition  !px-3 !py-2 rounded-full w-full"
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Characteristics Section */}
      <div className="flex">
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
              className="border-2 border-[#A6C78A] rounded-lg !p-2 flex-1 focus:outline-1 outline-[#95B574]"
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
              className="border-2 border-[#A6C78A] rounded-lg !p-2 flex-1 focus:outline-1 outline-[#95B574]"
            />
            <input
              name="height"
              placeholder="Height (cm)"
              type="number"
              value={formData.height}
              onChange={handleChange}
              min="1"
              max="300"
              className="border-2 border-[#A6C78A] rounded-lg !p-2 flex-1 focus:outline-1 outline-[#95B574]"
            />
            <input
              name="weight"
              placeholder="Weight (kg)"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              min="1"
              max="500"
              className="border-2 border-[#A6C78A] rounded-lg !p-2 flex-1 focus:outline-1 outline-[#95B574]"
            />
          </div>
          <div className="w-full flex justify-center">
            <button className="bg-[#A6C78A] hover:bg-[#95B574] transition  !px-4 !py-2 rounded-full w-1/3"
              onClick={() => handleUpdate("characteristics")}
            >
              Update Characteristics
            </button> 
          </div>
        </div>
      </div>

      {/* Admin User Search Section */}
      {getUserRoleFromToken() === "admin" && (
        <>
          <div className="flex !pt-4">
            <div className="card w-full bg-[#D5FAB8] !p-4 !m-4 !mt-0 rounded-lg">
              <p className="font-semibold !mb-4 text-xl">User Management</p>

              {/* Search Controls */}
              <div className="flex h-12 w-full !mb-4">
                {/* Search Type Toggle */}
                <div className="w-1/6 h-full rounded-full bg-white !p-1 flex relative">
                  <div
                    className={`absolute top-1 bottom-1 bg-[#A6C78A] rounded-full transition-all duration-300 ease-in-out ${
                      searchType === 'email' ? 'left-1/2 right-1' : 'left-1 right-1/2'}`}/>

                  <button onClick={() => handleSearchTypeToggle("username")}
                    className={`w-1/2 h-full rounded-full !mr-1 transition-all duration-50 relative z-10 border-dashed border-[#A6C78A]
                    ${ searchType === 'email' ? 'hover:border-3' : 'border-3'}`}>Username</button>
                  <button onClick={() => handleSearchTypeToggle("email")}
                    className={`w-1/2 h-full rounded-full transition-all duration-50 relative z-10 border-dashed border-[#A6C78A]
                    ${ searchType === 'username' ? 'hover:border-3' : 'border-3'}`}>Email</button>
                </div>

                {/* Search Bar */}
                <div className="border-2 border-[#A6C78A] rounded-full w-5/6 !pl-4 !pr-4 !ml-4 focus:outline-1 outline-[#A6C78A] flex items-center">
                  <img src={searchImg} className="w-6 h-6 !mr-2"/>
                  <input
                    className="h-full w-full outline-0"
                    type="search"
                    placeholder={`Search users by ${searchType}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* User Table */}
              <div className="w-full max-h-96 overflow-auto">
                {isSearching ? (
                  <div className="w-full flex justify-center !py-8">
                    <p className="text-lg">Searching users...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="w-full flex justify-center !py-8">
                    <p className="text-lg !px-4 !py-2 rounded-lg bg-[#E5F3DA] border-[#A6C78A] border-3 border-dashed w-fit">
                      No users found.
                    </p>
                  </div>
                ) : (
                  <table className="w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-[#A6C78A] ">
                      <tr>
                        <th className="!px-4 !py-3 text-left font-semibold">Username</th>
                        <th className="!px-4 !py-3 text-left font-semibold">Email</th>
                        <th className="!px-4 !py-3 text-left font-semibold">Role</th>
                        <th className="!px-4 !py-3 text-left font-semibold">Created</th>
                        <th className="!px-4 !py-3 text-center font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((userData, index) => {
                        const isEditing = editingUserId === userData._id;
                        return (
                          <tr key={userData._id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-[#E5F3DA] transition-colors`}>
                            {/* Username Column */}
                            <td className="!px-4 !py-3 font-medium w-1/3">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editFormData.username}
                                  onChange={(e) => handleEditInputChange('username', e.target.value)}
                                  className="w-full border-2 border-[#A6C78A] rounded-lg !px-2 !py-1 focus:outline-1 outline-[#95B574]"
                                />
                              ) : (
                                userData.username
                              )}
                            </td>

                            {/* Email Column */}
                            <td className="!px-4 !py-3 w-1/3">
                              {isEditing ? (
                                <input
                                  type="email"
                                  value={editFormData.email}
                                  onChange={(e) => handleEditInputChange('email', e.target.value)}
                                  className="w-full border-2 border-[#A6C78A] rounded-lg !px-2 !py-1 focus:outline-1 outline-[#95B574]"
                                />
                              ) : (
                                userData.email
                              )}
                            </td>

                            {/* Role Column */}
                            <td className="!px-4 !py-3 w-1/9">
                              {isEditing ? (
                                <div className={`w-24 h-8 rounded-full flex relative transition duration-300 ${
                                  editFormData.role == 'admin' ?
                                  'bg-red-100' : 'bg-blue-100'
                                }`}>
                                  <div
                                    className={`absolute top-0 bottom-0 w-1/2 rounded-full transition-all duration-300 ease-in-out ${
                                      editFormData.role === 'admin' ?
                                        'right-0 bg-red-200' :
                                        'right-12 bg-blue-200'
                                    }`}/>

                                  <button
                                    onClick={() => handleEditInputChange('role', 'user')}
                                    className={`w-1/2 h-full rounded-full transition-all duration-50 relative z-10 text-xs font-medium ${
                                      editFormData.role === 'admin' ?
                                        'text-black hover:text-blue-800' :
                                        'text-blue-800'
                                    }`}
                                  >
                                    User
                                  </button>
                                  <button
                                    onClick={() => handleEditInputChange('role', 'admin')}
                                    className={`w-1/2 h-full rounded-full transition-all duration-50 relative z-10 text-xs font-medium ${
                                      editFormData.role === 'user' ?
                                        'text-black hover:text-red-800' :
                                        'text-red-800'
                                    }`}
                                  >
                                    Admin
                                  </button>
                                </div>
                              ) : (
                                <span className={`!px-2 !py-1 rounded-full text-sm font-medium ${
                                  userData.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {userData.role}
                                </span>
                              )}
                            </td>

                            {/* Created Date Column */}
                            <td className="!px-4 !py-3 text-sm text-gray-600 w-1/9">
                              {new Date(userData.createdAt).toLocaleDateString()}
                            </td>

                            {/* Actions Column */}
                            <td className="!px-4 !py-3 w-1/18">
                              <div className="flex justify-center gap-2">
                                {isEditing ? (
                                  <>
                                    {/* Save Button */}
                                    <button
                                      onClick={saveUserChanges}
                                      className="w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition active:scale-90"
                                    >
                                      <img className="w-6 h-6" src={checkImg} alt="Save"/>
                                    </button>
                                    {/* Cancel Button */}
                                    <button
                                      onClick={cancelEditingUser}
                                      className="w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition active:scale-90"
                                    >
                                      <img className="w-6 h-6" src={crossImg} alt="Cancel"/>
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    {/* Edit Button */}
                                    <button
                                      onClick={() => startEditingUser(userData)}
                                      className="w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition active:scale-90"
                                    >
                                      <img className="w-6 h-6" src={editImg} alt="Edit"/>
                                    </button>
                                    {/* Delete Button */}
                                    <button
                                      onClick={() => deleteUser(userData._id, userData.username)}
                                      className="w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition active:scale-90"
                                    >
                                      <img className="w-6 h-6" src={trashImg} alt="Delete"/>
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
}
