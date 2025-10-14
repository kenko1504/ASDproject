import { useState, useRef } from "react";
import axios from "axios"
import uploadIcon from "../../assets/Upload.svg"
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
          <div className="bg-[#85BC59] w-8/12 h-10/12 rounded-[10px] shadow-2xl flex flex-col items-center">
            {/* Header */}
            <div className="relative w-full h-10 p-10 flex items-center justify-center mb-4">
              <h2 className="text-white text-center">Ingredient Details</h2>
              <button onClick={onClose}
                className="absolute right-3 text-[#36874D] hover:text-white-600 text-2xl font-bold leading-none"
              >
                ×
              </button>
            </div>
            {/* insert image block}
            */}
            {result ? (
                    <div className="p-2 rounded mt-2 w-11/12 h-10/12 overflow-scroll-auto">
                      <form action="" className="flex flex-col gap-4">
                        <div className="flex justify-between py-2 text-center">
                          <label className="flex-2 ">
                            Name
                          </label>
                          <label className="flex-1">
                            Quantity(g)
                          </label>
                          <label className="flex-1">
                            Price
                          </label>
                          <label className="flex-1">
                            Expiry Date
                          </label>
                        </div>
                        {result.data.names?.map((name, index) => (
                          <div key={index} className="flex justify-between py-2 h-1/12 gap-3">
                            <input type="text" defaultValue={name} className="border rounded w-full flex-2" required/>
                            <input type="text" defaultValue={result.data.quantities[index] ? result.data.quantities[index] : ""} className="border rounded w-full flex-1 text-right" required/>
                            <input type="text" defaultValue={result.data.prices[index] ? result.data.prices[index] : ""} className="border rounded w-full flex-1 text-right" required/>
                            <input type="date" defaultValue={result.data.shoppingDate ? result.data.shoppingDate : ""} className="border rounded w-full flex-1 text-right"  placeholder="Expiry Date" required/>
                          </div>
                        ))}
                      <button onClick={handleSubmit} className="mt-4 bg-white text-green-600 px-4 py-2 rounded hover:bg-gray-200 w-4/12 self-center">
                        Save Ingredients
                      </button>
                      </form>
                      
                    </div>
                  ) : (
              <div className="flex flex-col items-center w-full h-full">
                  {loading ? (
                      <div>
                        <div role="status">
                          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                          </svg>
                          <span className="sr-only">Processing...</span>
                        </div>
                      </div>
                  ): (
                    <div onClick={handleClick} className="bg-gradient-to-b from-[#A1CF7B] to-[#85BC59] border-dotted border-3 border-[#A1CF7B] h-11/12 w-10/12 m-4 rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-green-300">
                      <img src={uploadIcon} alt="uploadIcon" className="w-10 h-10 mb-2" />
                      <span className="text-white text-3xl">Click to Upload Receipt Image</span>
                    </div>
                  )}
              </div>
            )}
            <input
            type="file"
            ref={fileInputRef}
            onChange={handleChange}
            className="hidden"
            accept="image/*"
            />
          </div>
        </div>
  );
}
