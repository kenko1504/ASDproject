import { useState, useRef } from "react";
import axios from "axios"

export default function AutoIngredientPopUp({ onClose }) {

  // use state for form
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click(); // trigger file input
  };

  const handleSubmit = async () => {
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
    const res = await fetch("http://localhost:5000/ingredients", {
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

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post('http://localhost:5000/receipt/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setResult(response.data);
        console.log('Document AI Result:', response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }else{
      return;
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
            {loading && <p>Processing...</p>}
            {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
          </div>
        </div>
  );
}
