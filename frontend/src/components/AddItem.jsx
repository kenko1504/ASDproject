import {useState} from "react";

export default function AddItem({onAdd}) {
    const [form, setForm] = useState({
        name: "",
        quantity: "",
        price: "",
        category: "Other",
        expiryDate: "",
        imgUrl: ""
    });

    const availableImages = ["beef.jpg", "pear.jpg"]; //images in the images directory
    const [errors, setErrors] = useState({}); // error handling

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // check if the entered data is valid
        let newErrors = { ...errors };
        if (name === "quantity" && !/^[1-9]\d*$/.test(value)) {
            newErrors.quantity = "Quantity must be a positive integer";
        } else {
            delete newErrors.quantity;
        }
        if (name === "price" && !/^\d+(\.\d{1,2})?$/.test(value)) {
            newErrors.price = "Price must be a number with up to 2 decimal places";
        } else {
            delete newErrors.price;
        }
        setErrors(newErrors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            const res = await fetch("http://localhost:5000/items", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: form.name,
                    quantity: form.quantity,
                    price: form.price,
                    category: form.category,
                    expiryDate: form.expiryDate,
                    imgUrl: form.imgUrl
                })
            });

            if (!res.ok) {
                throw new Error("Failed to add item");
            }

            const data = await res.json();
            onAdd(data); // notify the parent component

            //reset the form
            setForm({
                name: "",
                quantity: "",
                price: "",
                category: "Other",
                expiryDate: "",
                imgUrl: ""
            });
            setErrors({});
        } catch (err) {
            console.error("Error adding item:", err);
        }
    };

    return (
        <div className="content roboto" style={{ maxWidth: "700px", margin: "40px auto" }}>
            <h2 className={"justify-self-center text-3xl font-bold text-gray-800"} style={{textAlign:"center", marginBottom: "20px"}}>Add Item</h2>
            <form onSubmit={handleSubmit} style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                width:"100%",
                marginLeft:"50px"
            }}>
                <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    margin:"auto"
                }}>
                    <tbody>
                    <tr>
                        <td style={{ padding: "10px", fontWeight: "500" }}>Name:</td>
                        <td style={{ padding: "10px" }}>
                            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required style={{
                                width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc"
                            }}/>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: "10px", fontWeight: "500" }}>Quantity:</td>
                        <td style={{ padding: "10px" }}>
                            <input name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} required style={{
                                width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc"
                            }}/>
                            {/*quantity error handling*/}
                            {errors.quantity && <p style={{ color: "red", fontSize: "14px" }}>{errors.quantity}</p>}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: "10px", fontWeight: "500" }}>Price:</td>
                        <td style={{ padding: "10px" }}>
                            <input name="price" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required style={{
                                width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc"
                            }}/>
                            {/*price error handling*/}
                            {errors.price && <p style={{ color: "red", fontSize: "14px" }}>{errors.price}</p>}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: "10px", fontWeight: "500" }}>Category:</td>
                        <td style={{ padding: "10px" }}>
                            <select name="category" value={form.category} onChange={handleChange} style={{
                                width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc"
                            }}>
                                <option value="Meat">Meat</option>
                                <option value="Vegetable">Vegetable</option>
                                <option value="Fruit">Fruit</option>
                                <option value="Drink">Drink</option>
                                <option value="Other">Other</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: "10px", fontWeight: "500" }}>ExpiryDate:</td>
                        <td style={{ padding: "10px" }}>
                            <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} required style={{
                                width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc"
                            }}/>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: "10px", fontWeight: "500" }}>Image:</td>
                        <td style={{ padding: "10px" }}>
                            <select name="imgUrl" value={form.imgUrl} onChange={handleChange} style={{
                                width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "6px"
                            }}>
                                <option value={""}>--Select an image--</option>
                                {availableImages.map((img, i) => (
                                    <option key={i} value={img}>{img}</option>
                                ))}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td colSpan={2} style={{ textAlign: "center", paddingTop: "20px" }}>
                            <button type="submit" style={{
                                marginRight: "100px", padding: "10px 20px",
                                backgroundColor: "#10b981", color: "white",
                                border: "none", borderRadius: "6px", cursor: "pointer"
                            }}>Add Item</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}