import { useState } from "react";

export default function AddItem({ onAdd }) {
    const [form, setForm] = useState({
        name: "",
        quantity: "",
        price: "",
        category: "Other",
        expiryDate: "",
        imgUrl: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    quantity: form.quantity,
                    price: form.price,
                    category: form.category,
                    expiryDate: form.expiryDate,
                    imgUrl: form.imgUrl
                })
            });

            if(!res.ok){
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
        } catch (err) {
            console.error("Error adding item:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            Name:<input name="name" placeholder="Name" value={form.name} onChange={handleChange} required /><br/>
            Quantity:<input name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} required /><br/>
            Price:<input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required /><br/>
            Category:
            <select name="category" value={form.category} onChange={handleChange}>
                <option value="Meat">Meat</option>
                <option value="Vegetable">Vegetable</option>
                <option value="Fruit">Fruit</option>
                <option value="Drink">Drink</option>
                <option value="Other">Other</option>
            </select><br/>
            ExpiryDate:<input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} required /><br/>
            ImgUrl:<input name="imgUrl" placeholder="Image URL" value={form.imgUrl} onChange={handleChange} /><br/>
            <button type="submit">Add Item</button>
        </form>
    );
}