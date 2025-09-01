import { useState, useEffect } from "react";

export default function UpdateItem({ item, onUpdate, onCancel }) {
    const [form, setForm] = useState({
        name: "",
        quantity: "",
        price: "",
        category: "Other",
        expiryDate: "",
        imgUrl: ""
    });

    useEffect(() => {
        if (item) {
            setForm({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                category: item.category,
                expiryDate: item.expiryDate.split("T")[0], // formate date
                imgUrl: item.imgUrl || ""
            });
        }
    }, [item]);


    //update item
    const handleUpdateItem = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await fetch(`http://localhost:5000/items/${item._id}`, {
                method:"PUT",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });
            if(!res.ok){
                throw new Error("Failed to update item");
            }
            const updated = await res.json();
            onUpdate(updated); // notify parent component to update data
        }catch (err){
            console.error("Failed in updating item: ", err);
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{marginTop: "20px"}}>
            <h3>Update Item</h3>
            Image URL:<input name="imgUrl" value={form.imgUrl} onChange={handleUpdateItem} placeholder="Image URL"/><br/>
            Name:<input name="name" value={form.name} onChange={handleUpdateItem} required/><br/>
            Quantity:<input name="quantity" value={form.quantity} onChange={handleUpdateItem} required/><br/>
            Price($):<input name="price" type="number" value={form.price} onChange={handleUpdateItem} required/><br/>
            Category:
            <select name="category" value={form.category} onChange={handleUpdateItem}>
                <option value="Meat">Meat</option>
                <option value="Vegetable">Vegetable</option>
                <option value="Fruit">Fruit</option>
                <option value="Drink">Drink</option>
                <option value="Other">Other</option>
            </select><br/>
            Expiry Date:<input name="expiryDate" type="date" value={form.expiryDate} onChange={handleUpdateItem} required/><br/>
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel} style={{marginLeft: "10px"}}>
                Cancel
            </button>
        </form>
    );
}