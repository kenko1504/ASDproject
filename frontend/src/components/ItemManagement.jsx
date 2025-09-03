import {useState, useEffect} from "react";
import {Routes, Route, useNavigate} from "react-router-dom";
import AddItem from "./AddItem.jsx";
import UpdateItem from "./UpdateItem.jsx";
import "../index.css";



export default function ItemManagement() {
    const [items, setItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null); // on editing item
    const [searchItem, setSearchItem] = useState(""); // search item by name
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/items")
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(err => console.error(err));
    }, []);

    //add item
    const handleAddItem = (newItem) => {
        setItems([...items, newItem]);
        navigate("/item-management"); // return to item list page after adding successfully
    }

    //click update button to open form
    const handleEditClick = (item) => {
        setEditingItem(item);
    }

    //delete item
    const handleDeleteItem = async (id) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this item?");
            if (!confirmDelete) {
                return;
            }

            const res = await fetch(`http://localhost:5000/items/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                throw new Error("Failed to delete the item");
            }
            setItems(items.filter(item => item._id !== id)); // update state
        } catch (err) {
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
        <Routes>
            {/* Item List */}
            <Route path="/" element={
                <div className={"content"}>
                    <h1>Fridge Application</h1><br/>
                    <h2>Item Management</h2>

                    {/* searching box */}
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchItem}
                        onChange={(e) => setSearchItem(e.target.value)}
                        style={{ marginBottom: "10px", padding: "5px" }}
                    />

                    <table border="1" align="center">
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
                                    {/*{item.imgUrl ? (<img src={item.imgUrl} alt={""} width="50" />) : (" - ")}*/}
                                    {item.imgUrl ? (
                                        <img
                                            src={new URL(`../images/${item.imgUrl}`, import.meta.url)}
                                            alt={""}
                                            style={{width: "80px", height:"80px"}}
                                        />
                                    ) : (" - ")}
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
                        {/* Add Item button*/}
                        <tfoot>
                        <tr>
                            <td colSpan={7} align="center">
                                <button onClick={() => navigate("addItem")}>Add Item</button>
                            </td>
                        </tr>
                        </tfoot>
                    </table>

                    {/* Update form */}
                    {editingItem &&
                        (<UpdateItem item={editingItem} onUpdate={handleUpdateItem} onCancel={() => setEditingItem(null)} />)
                    }
                </div>
            } />

            {/* Add Item page */}
            <Route path="addItem" element={
                <div>
                    <AddItem onAdd={handleAddItem} />
                    <button onClick={() => navigate("/item-management")}>Back</button>
                </div>
            } />
        </Routes>
    );

}