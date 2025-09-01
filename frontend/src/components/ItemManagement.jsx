import { useState, useEffect } from "react";
import AddItem from "./AddItem.jsx";
import UpdateItem from "./UpdateItem.jsx";
import {Route, Routes} from "react-router-dom";
import WasteBudget from "./WasteBudget.jsx";

export default function ItemManagement(){
    const [items, setItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null); // on editing item
    const [searchItem, setSearchItem] = useState(""); // search item by name

    useEffect(() => {
        fetch("http://localhost:5000/items")
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(err => console.error(err));
    }, []);

    //add item
    const handleAddItem = (newItem) => {
        setItems([...items, newItem]);
    }

    //click update button to open form
    const handleEditClick = (item) => {
        setEditingItem(item);
    }

    //delete item
    const handleDeleteItem = async (id) => {
        try{
            const confirmDelete = window.confirm("Are you sure you want to delete this item?");
            if(!confirmDelete){
                return;
            }

            const res = await fetch(`http://localhost:5000/items/${id}`, {
                method: "DELETE"
            });

            if(!res.ok){
                throw new Error("Failed to delete the item");
            }
            setItems(items.filter(item => item._id !== id)); // update state
        }catch (err){
            console.error("Failed in deleting the item: ", err);
        }
    }

    //update item
    const handleUpdateItem = async (updatedItem) => {
        setItems(items.map(item => (
            item._id === updatedItem._id ? updatedItem : item
        )));
        setEditingItem(null); // hide form
    }

    const filteredItems = items.filter(
        item => item.name.toLowerCase().includes(searchItem.toLowerCase())
    );

    return (
        <div>
            <h1>Fridge Application</h1>
            {/*<h2>Ingredients</h2>*/}

            {/*<AddIngredient onAdd={handleAdd}/>*/}

            {/*<ul>*/}
            {/*    {ingredients.map(item => (*/}
            {/*        <li key={item._id}>*/}
            {/*            {item.name} - {item.quantity}*/}
            {/*        </li>*/}
            {/*    ))}*/}
            {/*</ul>*/}


            {/*Item Management frontend*/}
            <AddItem onAdd={handleAddItem}/>
            <h2>Item Management</h2>

            {/*search box*/}
            <input
                type={"text"}
                placeholder={"Search by name..."}
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                style={{marginBottom: "10px", padding: "5px"}}
            />

            {/*<ul>*/}
            {/*    {*/}
            {/*        items.map(item => (*/}
            {/*            <li key={item._id}>*/}
            {/*                {item.category}: {item.name} - {item.quantity} - {item.price} - Expiry: {new Date(item.expiryDate).toLocaleString()} <br/>*/}
            {/*            </li>*/}
            {/*        ))*/}
            {/*    }*/}
            {/*</ul>*/}
            <table border={"1"} align={"center"}>
                <thead>
                <tr>
                    <th>Category</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price($)</th>
                    <th>Expiry Date</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {filteredItems.map(item => (
                    <tr key={item._id}>
                        <td>{item.category}</td>
                        <td>
                            {item.imgUrl ? (<img src={item.imgUrl} alt={item.name} width="50"/>) : (" - ")}
                        </td>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price}</td>
                        <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
                        <td>
                            <button onClick={() => handleEditClick(item)}>Update</button>
                            <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/*if it's on editing, shows UpdateItem form*/}
            {editingItem &&
                (<UpdateItem item={editingItem} onUpdate={handleUpdateItem} onCancel={() => setEditingItem(null)}/>)
            }
        </div>
    );

}