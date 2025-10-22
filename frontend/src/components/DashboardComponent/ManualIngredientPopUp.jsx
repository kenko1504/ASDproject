import { useState, useRef } from "react";
import { API_BASE_URL } from '../../utils/api.js';

export default function AddIngredientPopUp({ onClose, onAdded }) {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Other");
    const [expiryDate, setExpiryDate] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click(); // trigger file input
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file); // preview the image
            setImage(url);
        }
    };

    const validate = () => {
        const nameRegex = /^[a-zA-Z0-9 ]+$/;
        const priceRegex = /^\d+(\.\d{1,2})?$/;
        const errors = {};

        if (!name.trim()) errors.name = "Name is required.";
        else if (!nameRegex.test(name.trim()))
            errors.name = "Only letters, numbers and spaces are allowed.";
        else if (name.trim().length > 15)
            errors.name = "Name cannot exceed 15 characters.";

        if (quantity === "") errors.quantity = "Quantity is required.";
        else if (isNaN(Number(quantity)) || Number(quantity) <= 0)
            errors.quantity = "Quantity must be a positive number.";

        if (price === "") errors.price = "Price is required.";
        else if (!priceRegex.test(String(price)))
            errors.price = "Price must have up to 2 decimals.";

        if (!category) errors.category = "Category is required.";

        if (!expiryDate) errors.expiryDate = "Expiry date is required.";

        return errors;
    };

    const handleSubmit = async () => {
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            alert(Object.values(errors).join("\n")); // show all errors in a single alert
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("quantity", quantity);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("expiryDate", expiryDate);
        formData.append("description", description);
        formData.append("inFridge", true);

        const file = fileInputRef.current?.files?.[0];
        if (file) formData.append("image", file);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/ingredients`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token || ""}` },
                body: formData
            });
            const result = await res.json();

            if (!res.ok) {
                throw new Error(result?.error || `Request failed with ${res.status}`);
            }

            if (typeof onAdded === "function") onAdded(result);
            onClose?.();
        } catch (err) {
            console.error("Error:", err);
            alert(err.message || "Failed to add ingredient.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-[#85BC59] w-[400px] h-[500px] rounded-[10px] shadow-2xl flex flex-col items-center">
                {/* Header */}
                <div className="h-10 p-10 flex items-center justify-center mb-4 w-full">
                    <h2 className="text-white">Ingredient Details</h2>
                    <button
                        onClick={onClose}
                        className="relative right-[-120px] text-[#36874D] hover:text-white-600 text-2xl font-bold leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* Image Upload */}
                <div
                    onClick={handleClick}
                    className="bg-gradient-to-b from-[#A1CF7B] to-[#85BC59] h-[180px] w-[370px] m-4 rounded-[10px] flex items-center justify-center cursor-pointer"
                >
                    {image ? (
                        <img src={image} alt="uploaded" className="h-full object-cover rounded-[10px]" />
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

                {/* Form */}
                <div className="w-[370px] flex-1 flex flex-col justify-center">
                    <div className="w-[370px] flex-1 flex flex-row justify-between px-6">
                        <div className=" w-[120px] flex flex-col gap-2 pt-1">
                            <label className="text-white">Name:</label>
                            <label className="text-white">Quantity:</label>
                            <label className="text-white">Price($/500g):</label>
                            <label className="text-white">ExpiryDate:</label>
                            <label className="text-white">Category:</label>
                        </div>

                        <div className=" w-[200px] flex flex-col gap-2">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full text-white bg-[#36874D] rounded-[12px] shadow-[inset_0_3px_3px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-0 text-center"
                            />

                            <div className="flex gap-2">
                                <input
                                    type={"number"}
                                    step={"any"}
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-[110px] text-white bg-[#36874D] rounded-[11px] shadow-[inset_0_3px_3px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-0 text-center"
                                />
                                <select
                                    className="w-[70px] text-center text-white bg-[#36874D] rounded-[6px] shadow-[0_2px_5px_rgba(0,0,0,0.6)] focus:outline-none focus:ring-0 appearance-none"
                                    name="unit"
                                    defaultValue={"grams"}
                                >
                                    <option value="grams">g</option>
                                    <option value="none">n/a</option>
                                </select>
                            </div>

                            <input
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full text-white bg-[#36874D] rounded-[12px] shadow-[inset_0_3px_3px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-0 text-center"
                            />

                            <input
                                type="date"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                className="w-full text-white bg-[#36874D] rounded-[12px] shadow-[inset_0_3px_3px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-0 text-center"
                            />

                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full text-white bg-[#36874D] rounded-[12px] shadow-[inset_0_3px_3px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-0 text-center"
                            >
                                <option value="Meat">Meat</option>
                                <option value="Vegetable">Vegetable</option>
                                <option value="Fruit">Fruit</option>
                                <option value="Drink">Drink</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="w-full flex justify-center my-3">
                        <button
                            onClick={handleSubmit}
                            className="text-white !mb-10 h-[25px] w-[90px] bg-[#36874D] rounded-[15px] shadow-[0_4px_5px_rgba(0,0,0,0.5)]"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
