import { useState, useRef } from "react";

import { API_BASE_URL } from '../../utils/api.js';
export default function AddIngredientPopUp({ onClose }) {

  // use state for form
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click(); // trigger file input
  };

  const handleSubmit = async () => {
  const nameRegex = /^[a-zA-Z0-9 ]+$/;
  if (!nameRegex.test(name)) {
    alert("Name can only contain letters, numbers, and spaces.");
    return;
  }
  if (name.length > 15) {
    alert("Name cannot exceed 15 characters.");
    return;
  }
  if (!quantity) {
  alert("Quantity is required.");
  return;
  }
  if (quantity && (isNaN(quantity) || quantity <= 0)) {
    alert("Quantity must be a positive number.");
    return;
  }
  const formData = new FormData();
  formData.append("name", name);
  formData.append("quantity", quantity);
  formData.append("expiryDate", expiryDate);
  formData.append("description", description);
  formData.append("inFridge", true);
  
  if (fileInputRef.current.files[0]) {
    formData.append("image", fileInputRef.current.files[0]); // append actual file
  }

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/ingredients`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });
    const result = await res.json();
    console.log("Saved ingredient:", result);
    onClose();
  } catch (err) {
    console.error("Error:", err);
  }
};

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file); // preview the image
      setImage(url);
    }
  };
  return (
    <div 
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          {/* Popup form container. Change the dimension of the pop up here */}
          <div className="bg-[#85BC59] w-[400px] h-[464px] rounded-[10px] shadow-2xl flex flex-col items-center">
            {/* Header */}
            <div className="h-10 p-10 flex items-center justify-center mb-4">
              <h2 className="text-white">Ingredient Details</h2>
              <button onClick={onClose}
                className="relative right-[-120px] text-[#36874D] hover:text-white-600 text-2xl font-bold leading-none"
              >
                ×
              </button>
            </div>
            {/* insert image block}
            */}
            <div onClick={handleClick} className="bg-gradient-to-b from-[#A1CF7B] to-[#85BC59] h-[180px] w-[370px] m-4 rounded-[10px] flex items-center justify-center cursor-pointer">
              {image ? (
              <img src={image} alt="uploaded" className="h-full w-full object-cover rounded-[10px]" />
              ) : (
                <span className="text-white">Upload optional image here</span>
              )}
            </div>
            <input
            type="file"
            ref={fileInputRef}
            onChange={handleChange}
            className="hidden"
            accept="image/*"
            />
            {/* form */}
            <div className="w-[370px] h-[227px] flex flex-col justify-center">
              <div className="w-[370px] flex-1 flex flex-row justify-around p-10"
              >
                <div className=" w-[220px] flex flex-row justify-between items-center">
                  <div className="h-[90px] w-[80px] flex flex-col justify-around font-inter">
                    <div className="text-white">Name:</div>
                    <div className="text-white">Quantity:</div>
                    <div className="text-white">Expiration:</div>
                  </div>
                  {/*input fields */}
                  <div className=" w-[120px] h-[90px] flex flex-col justify-around">
                    <input type="text" placeholder="" onChange={(e) => setName(e.target.value)} className="placeholder:pl-2 w-[120px] text-white bg-[#36874D] rounded-[12px] shadow-[inset_0_3px_3px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-0 box-border text-center"/>
                    <div className="flex flex-row justify-between">
                      <input type="text" onChange={(e) => setQuantity(e.target.value)} className="w-[70px] text-white bg-[#36874D] rounded-[11px] shadow-[inset_0_3px_3px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-0"/>
                     
                      <select
                      className="text-center w-[40px] text-white bg-[#36874D] rounded-[6px] shadow-[0_2px_5px_rgba(0,0,0,0.6)] focus:outline-none focus:ring-0 appearance-none"
                      name="unit"
                      >
                      <option value="grams">g</option>
                      <option value="none">n/a</option>
                    </select>
                  </div>
                    <input type="text" placeholder="" onChange={(e) => setExpiryDate(e.target.value)} className="placeholder:pl-2 w-[120px] text-white text-center bg-[#36874D] rounded-[12px] shadow-[inset_0_3px_3px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-0"/>
                  </div>
                </div>
                <div className="w-[100px] flex flex-col justify-around items-center">
                  <button onClick={handleSubmit}className="text-white h-[45px] w-[90px] bg-[#36874D] rounded-[15px] shadow-[0_4px_5px_rgba(0,0,0,0.5)]">Submit</button>
                </div>
              </div>
              <div className=" flex-1 rounded-[10px] bg-[#A1CF7B] flex justify-center items-center">
                <textarea 
                  placeholder="Notes:" 
                  className="w-[350px] h-[100px] text-white placeholder:text-left placeholder:align-top p-2 bg-transparent resize-none focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          </div>
        </div>
  );
}