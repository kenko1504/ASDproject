import { useState, useRef, useContext } from "react";
import axios from "axios"
import uploadIcon from "../../assets/Upload.svg"
import { API_BASE_URL } from '../../utils/api.js';
import { AuthContext } from "../../contexts/AuthContext.jsx";

export default function AutoIngredientPopUp({ onClose }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const {user} = useContext(AuthContext)
  
  const fileInputRef = useRef(null);

  console.log(user)

  const handleClick = () => {
    fileInputRef.current.click(); // trigger file input
  };

   const handleDelete = (indexToDelete) => {
    console.log("Deleting index:", indexToDelete);
    setProducts(products.filter((_, index) => index !== indexToDelete));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const token = localStorage.getItem("token");
  console.log("Token:", token)
  console.log(products)
  for (const product of products) {
    try {
      const payload = {
        userId: user._id,
        name: product.name,
        quantity: product.quantity || 0,
        price: product.price || 0,
        category: "Other",
        expiryDate: product.expiryDate || result.data.shoppingDate
      };

      console.log("payload:", payload)
      const res = await fetch(`${API_BASE_URL}/items`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const itemResult = await res.json();
      console.log("Saved item:", itemResult);
      
    } catch (err) {
      console.error("Error saving item:", err);
      alert(`Failed to save ${product.name}`);
      return;
    }
  }
  
  alert("All ingredients saved successfully!");
  onClose();
};

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post(`${API_BASE_URL}/receipt/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setResult(response.data);
        const productsWithExpiry = response.data.data.products.map(product => ({
          ...product,
          expiryDate: response.data.data.shoppingDate || ""
        }));
      setProducts(productsWithExpiry);
      console.log('Document AI Result:', response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
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
                      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex py-2 text-center">
                          <label className="flex-[2]">
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
                          <label className="flex-1">DELETE</label>
                        </div>
                        {products.map((product, index) => (
                            <div key={index} className="flex py-2 gap-3">
                              <input 
                                type="text" 
                                value={product.name}
                                onChange={(e) => {
                                  const newProducts = [...products];
                                  newProducts[index].name = e.target.value;
                                  setProducts(newProducts);
                                }}
                                className="flex-[2] border rounded px-2 py-1 min-w-0" 
                                required
                              />
                              <input 
                                type="text" 
                                value={product.quantity}
                                onChange={(e) => {
                                  const newProducts = [...products];
                                  newProducts[index].quantity = e.target.value;
                                  setProducts(newProducts);
                                }}
                                className="flex-1 border rounded px-2 py-1 text-right min-w-0" 
                                required
                              />
                              <input 
                                type="text" 
                                value={product.price}
                                onChange={(e) => {
                                  const newProducts = [...products];
                                  newProducts[index].price = e.target.value;
                                  setProducts(newProducts);
                                }}
                                className="flex-1 border rounded px-2 py-1 text-right min-w-0" 
                                required
                              />
                              <input 
                                type="date" 
                                value={product.expiryDate || result.data.shoppingDate}
                                onChange={(e) => {
                                  const newProducts = [...products];
                                  newProducts[index].expiryDate = e.target.value;
                                  setProducts(newProducts);
                                }}
                                className="flex-1 border rounded px-2 py-1 min-w-0" 
                                required
                              />
                              <button
                                type="button"
                                onClick={() => handleDelete(index)}
                                className="flex-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 min-width-0"
                              >
                                DELETE
                              </button>
                            </div>
                        ))}
                      <button type="submit" className="mt-4 bg-white text-green-600 px-4 py-2 rounded hover:bg-gray-200 w-4/12 self-center">
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
