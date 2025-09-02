import { useState, useRef } from "react";

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
  
  const handleSubmit = async () => { // handle form submission to backend
    const data = { name, quantity, expiryDate, description };

    try {
      const res = await fetch("http://localhost:5000/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
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
                <div className="w-[200px] flex flex-row justify-between items-center">
                  <div className="h-[90px] w-[80px] flex flex-col justify-around font-inter">
                    <div className="text-white">Name:</div>
                    <div className="text-white">Quantity:</div>
                    <div className="text-white">Expiration:</div>
                  </div>
                  {/*input fields */}
                  <div className="w-[100px] h-[90px] flex flex-col justify-around">
                    <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} className="w-[100px] text-white bg-[#36874D] rounded-[7px]"/>
                    <div className="flex flex-row">
                      <input type="text" onChange={(e) => setQuantity(e.target.value)} className="w-[60px] text-white bg-[#36874D] rounded-[7px]"/>
                      <input type="text" placeholder="Unit" className="w-[40px] text-white bg-[#36874D] rounded-[7px]"/>
                    </div>

                    <input type="text" placeholder="date" onChange={(e) => setExpiryDate(e.target.value)} className="w-[100px] text-white bg-[#36874D] rounded-[7px]"/>
                  </div>
                </div>
                <div className=" w-[100px] flex flex-col justify-around items-center">
                  <button onClick={handleSubmit}className="text-white h-[30px] w-[70px] bg-[#36874D] rounded-[7px]">Submit</button>
                </div>
              </div>
              <div className="flex-1 rounded-[10px] bg-[#A1CF7B] flex justify-center">
                <input type="text" placeholder="Notes:" className="w-[350px] text-white"/>
              </div>
            </div>
          </div>
        </div>
  );
}
