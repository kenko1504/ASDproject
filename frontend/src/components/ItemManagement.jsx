import {useState, useEffect} from "react";
import {Routes, Route, useNavigate} from "react-router-dom";
import AddItem from "./AddItem.jsx";
import UpdateItem from "./UpdateItem.jsx";
import "../CSS/index.css";



export default function ItemManagement() {
    const [items, setItems] = useState([]);
    // const [editingItem, setEditingItem] = useState(null); // on editing item
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
    // const handleEditClick = (item) => {
    //     setEditingItem(item);
    // }

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
        navigate("/item-management"); //return to item management page after updating
    }

    const filteredItems = items.filter(
        item => item.name.toLowerCase().includes(searchItem.toLowerCase())
    );

    return (
        <Routes>
            {/* Item Management */}
            <Route path="/" element={
                <div className={"content roboto"}>
                    <h2 className={"justify-self-center text-3xl font-bold text-gray-800"} style={{textAlign:"center", margin:"20px"}}>Item Management</h2>

                    {/* searching box */}
                    <div style={{textAlign: "center", marginBottom: "20px"}}>
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchItem}
                            onChange={(e) => setSearchItem(e.target.value)}
                            // style={{marginBottom: "10px", padding: "5px"}}
                            style={{
                                marginBottom:"10px",
                                padding:"2px 8px",
                                border:"1px solid black",
                                borderRadius:"4px",
                                width:"50%"
                            }}
                        />
                    </div>

                    {/*border="1" align="center"*/}
                    <table style={{
                        width: "122%",
                        margin: "20px auto",
                        borderCollapse: "collapse",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        backgroundColor: "white",
                        borderRadius: "8px",
                    }}>
                        <thead style={{backgroundColor:"#f1f5f9"}}>
                        <tr>
                            <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #e2e8f0" }}>Category</th>
                            <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #e2e8f0" }}>Image</th>
                            <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #e2e8f0" }}>Name</th>
                            <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #e2e8f0" }}>Quantity</th>
                            <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #e2e8f0" }}>Price($)</th>
                            <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #e2e8f0" }}>Expiry Date</th>
                            <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #e2e8f0" }}>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredItems.map(item => (
                            <tr key={item._id} style={{
                                textAlign: "center"
                            }}>
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
                                    <button onClick={() => navigate(`/item-management/update/${item._id}`)} style={{
                                        marginRight: "6px",
                                        padding: "6px 12px",
                                        border: "none",
                                        borderRadius: "4px",
                                        backgroundColor: "#407bda",
                                        color: "white",
                                        cursor: "pointer"
                                    }}>Update</button>
                                    <button onClick={() => handleDeleteItem(item._id)} style={{
                                        padding: "6px 12px",
                                        border: "none",
                                        borderRadius: "4px",
                                        backgroundColor: "#ef4444",
                                        color: "white",
                                        cursor: "pointer"
                                    }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        {/* Add Item button*/}
                        <tfoot>
                        <tr>
                            <td colSpan={7} style={{ textAlign: "center", padding: "12px" }}>
                                <button onClick={() => navigate("addItem")} style={{
                                    padding: "8px 16px",
                                    border: "none",
                                    borderRadius: "6px",
                                    backgroundColor: "#10b981",
                                    color: "white",
                                    fontWeight: "500",
                                    cursor: "pointer"
                                }}>Add Item</button>
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            } />

            {/*Update item page*/}
            <Route path="update/:id" element={
                <UpdateItem onUpdate={handleUpdateItem} onCancel={() => navigate("/item-management")}/>
            }/>

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