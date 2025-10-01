import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

export default function UpdateItem({onUpdate, onCancel}) {
    const {id} = useParams();
    const [form, setForm] = useState({
        name: "",
        quantity: "",
        price: "",
        category: "Other",
        expiryDate: "",
        imgUrl: ""
    });

    const availableImages = ["beef.jpg", "pear.jpg"]; //images in the images directory
    const [errors, setErrors] = useState({});//store the error information

    useEffect(() => {
        //fetch the item details by id
        fetch(`http://localhost:5000/items/${id}`)
            .then(res => res.json())
            .then(data => setForm({
                ...data,
                expiryDate: data.expiryDate.split("T")[0], // formated date
            }))
            .catch(err => console.error(err))
    }, [id]);


    //update item
    const handleUpdateItem = (e) => {
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
            const res = await fetch(`http://localhost:5000/items/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });
            if (!res.ok) {
                throw new Error("Failed to update item");
            }
            const updated = await res.json();
            onUpdate(updated); // notify parent component to update data
        } catch (err) {
            console.error("Failed in updating item: ", err);
        }
    }

    return (
        <div className={"content roboto"} style={{ maxWidth: "700px", margin: "40px auto" }}>
            <h2 className={"justify-self-center text-3xl font-bold text-gray-800"} style={{textAlign:"center", marginBottom: "20px"}}>Update Item</h2>
            <form onSubmit={handleSubmit} style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                width:"100%"
            }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                    <tr>
                        <td style={{ padding: "10px", fontWeight: "500" }}>Image:</td>
                        <td style={{ padding: "10px" }}>
                            <select name="imgUrl" value={form.imgUrl} onChange={handleUpdateItem} style={{
                                width: "100%",
                                padding: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "6px"
                            }}>
                                <option value={""}>--Select an image--</option>
                                {availableImages.map((img, i) => (
                                    <option key={i} value={img}>{img}</option>
                                ))}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: "10px", fontWeight: "500" }}>Name:</td>
                        <td style={{ padding: "10px" }}>
                            <input name="name" value={form.name} onChange={handleUpdateItem} required style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: "6px",
                                border: "1px solid #ccc"
                            }}/>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: "10px", fontWeight: "500" }}>Quantity:</td>
                        <td style={{ padding: "10px" }}>
                            <input name="quantity" value={form.quantity} onChange={handleUpdateItem} required
                                   style={{
                                       width: "100%",
                                       padding: "8px",
                                       borderRadius: "6px",
                                       border: "1px solid #ccc"
                            }}/>
                            {/*quantity error handling*/}
                            {errors.quantity && <p style={{ color: "red", fontSize: "14px" }}>{errors.quantity}</p>}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: "10px", fontWeight: "500" }}>Price($):</td>
                        <td style={{ padding: "10px" }}>
                            <input name="price" value={form.price} onChange={handleUpdateItem} required style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: "6px",
                                border: "1px solid #ccc"
                            }}/>
                            {/*price error handling*/}
                            {errors.price && <p style={{ color: "red", fontSize: "14px" }}>{errors.price}</p>}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: "10px", fontWeight: "500" }}>Category:</td>
                        <td style={{ padding: "10px" }}>
                            <select name="category" value={form.category} onChange={handleUpdateItem} style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: "6px",
                                border: "1px solid #ccc"
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
                        <td style={{ padding: "10px", fontWeight: "500" }}>Expiry Date:</td>
                        <td style={{ padding: "10px" }}>
                            <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleUpdateItem} required style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: "6px",
                                border: "1px solid #ccc"
                            }}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{ textAlign: "center", padding: "20px" }}>
                            <button type="submit" style={{
                                marginLeft: "10px",
                                padding: "10px 20px",
                                backgroundColor: "#10b981",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer"
                            }}>
                                Save
                            </button>
                        </td>
                        <td>
                            <button type="button" onClick={onCancel} style={{
                                padding: "10px 20px",
                                backgroundColor: "#9ca3af",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer"
                            }}>
                                Cancel
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}