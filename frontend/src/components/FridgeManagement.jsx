import {useState, useEffect, useCallback, useMemo} from "react";
import {Routes, Route, useNavigate} from "react-router-dom";
// import AddItem from "./AddItem.jsx";
import UpdateItem from "./UpdateItem.jsx";
import "../CSS/index.css";

import { API_BASE_URL } from '../utils/api.js';

export default function FridgeManagement() {
    const [items, setItems] = useState([]);
    const [searchItem, setSearchItem] = useState(""); // search item by name
    //sorting switch
    const [openMenu, setOpenMenu] = useState({category: false, price: false, date: false})
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [priceSort, setPriceSort] = useState("none"); // none | asc | desc
    const [dateSort, setDateSort] = useState("none");   // none | asc | desc

    const navigate = useNavigate();

    const fetchIngredients = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return setItems([]);
            const res = await fetch(`${API_BASE_URL}/ingredients`, {
                headers: {Authorization: `Bearer ${token || ""}`},
            });
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("token");
                setItems([]);
                return;
            }
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setItems([]);
        }
    }, []);

    useEffect(() => {
        fetchIngredients();
    }, [fetchIngredients]);

    //close all filter switches when click on other area of the page
    useEffect(() => {
        const filterSwitchHandler = (e) => {
            if (!e.target.closest(".th-menu")) {
                setOpenMenu({category: false, price: false, date: false});
            }
        };
        document.addEventListener("click", filterSwitchHandler);
        return () => document.removeEventListener("click", filterSwitchHandler);
    }, []);


    const categories = useMemo(() => {
        const set = new Set(items.map(i => i.category).filter(Boolean));
        return ["All", ...Array.from(set)];
    }, [items]);

    //add item
    // const handleAddItem = (newItem) => {
    //     setItems([...items, newItem]);
    //     navigate("/item-management"); // return to item list page after adding successfully
    // }


    //delete item
    const handleDeleteItem = async (id) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this ingredient?");
            if (!confirmDelete) {
                return;
            }
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/ingredients/${id}`, {
                method: "DELETE",
                headers: {Authorization: `Bearer ${token || ""}`}
            });

            if (!res.ok) {
                throw new Error("Failed to delete the item");
            }
            await fetchIngredients();

        } catch (err) {
            console.error("Failed in deleting the item: ", err);
            alert("Delete failed");
        }
    }

    //update item
    const handleUpdateItem = async (updated) => {
        setItems((prev) => prev.map((i) => (i._id === updated._id ? updated : i)));
        await fetchIngredients();
        navigate("/fridge"); //return to fridge page after updating
    }

    //filter, sorting
    const filteredItems = useMemo(() => {
        let list = Array.isArray(items) ? [...items] : [];

        // searching
        const search = (searchItem || "").toLowerCase();
        list = list.filter(i => (i.name || "").toLowerCase().includes(search));

        // filter by category
        if (categoryFilter !== "All") {
            list = list.filter(i => i.category === categoryFilter);
        }

        // sorting by either price or expiry date
        if (priceSort !== "none") {
            list.sort((a, b) => {
                const av = Number(a.price ?? 0);
                const bv = Number(b.price ?? 0);
                return priceSort === "asc" ? av - bv : bv - av;
            });
        } else if (dateSort !== "none") {
            list.sort((a, b) => {
                const ta = a.expiryDate ? new Date(a.expiryDate).getTime() : Infinity;
                const tb = b.expiryDate ? new Date(b.expiryDate).getTime() : Infinity;
                return dateSort === "asc" ? ta - tb : tb - ta;
            });
        }
        return list;
    }, [items, searchItem, categoryFilter, priceSort, dateSort]);

    //drop-down menu
    const Menu = ({open, children}) => {
        if (!open) return null;
        return (
            <div
                className="absolute z-10 bg-white border border-gray-200 rounded shadow-md text-sm"
                style={{top: "100%", left: "50%", transform: "translateX(-50%)", minWidth: 160}}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        );
    };


    return (
        <Routes>
            {/* Fridge Management */}
            <Route path={"/"} element={
                <div
                    className={"content roboto"}
                    style={{
                        maxWidth: "950px",
                        width: "100%",
                        margin: "20px auto",
                        padding: "0 16px"
                    }}
                >
                    <h2 className={"justify-self-center text-3xl font-bold text-gray-800"} style={{
                        textAlign: "center",
                        margin: "20px"
                    }}>Fridge Management</h2>

                    {/* searching box, search by name */}
                    <div style={{textAlign: "center", marginBottom: "20px"}}>
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchItem}
                            onChange={(e) => setSearchItem(e.target.value)}
                            style={{
                                marginBottom: "10px",
                                padding: "2px 8px",
                                border: "1px solid black",
                                borderRadius: "4px",
                                width: "50%"
                            }}
                        />
                    </div>

                    <table style={{
                        width: "100%",
                        margin: "20px auto",
                        borderCollapse: "collapse",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        backgroundColor: "white",
                        borderRadius: "8px",
                    }}>
                        <thead style={{backgroundColor: "#f1f5f9"}}>
                        <tr>
                            {/*category with a sorting function*/}
                            <th
                                className="th-menu"
                                style={{
                                    padding: "12px",
                                    textAlign: "center",
                                    borderBottom: "2px solid #e2e8f0",
                                    position: "relative",
                                    cursor: "pointer"
                                }}
                                onClick={() => setOpenMenu({category: !openMenu.category, price: false, date: false})}
                                title="Filter by category"
                            >Category ▾
                                <Menu open={openMenu.category}>
                                    {categories.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => {
                                                setCategoryFilter(c);
                                                setOpenMenu({category: false, price: false, date: false});
                                            }}
                                            className={`block w-full text-left px-3 py-2 hover:bg-gray-100 ${c === categoryFilter ? "font-semibold" : ""}`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </Menu>
                            </th>
                            <th style={{
                                padding: "12px",
                                textAlign: "center",
                                borderBottom: "2px solid #e2e8f0"
                            }}>Image
                            </th>
                            <th style={{
                                padding: "12px",
                                textAlign: "center",
                                borderBottom: "2px solid #e2e8f0"
                            }}>Name
                            </th>
                            <th style={{
                                padding: "12px",
                                textAlign: "center",
                                borderBottom: "2px solid #e2e8f0"
                            }}>Quantity(g)
                            </th>

                            {/*price with sorting function*/}
                            <th className="th-menu"
                                style={{
                                    padding: "12px",
                                    textAlign: "center",
                                    borderBottom: "2px solid #e2e8f0",
                                    position: "relative",
                                    cursor: "pointer"
                                }}
                                onClick={() => setOpenMenu({category: false, price: !openMenu.price, date: false})}
                                title="Sort by price"
                            >Price($/500g) ▾
                                <Menu open={openMenu.price}>
                                    <button
                                        className={`block w-full text-left px-3 py-2 hover:bg-gray-100 ${priceSort === "none" ? "font-semibold" : ""}`}
                                        onClick={() => {
                                            setPriceSort("none");
                                            setDateSort("none");
                                            setOpenMenu({category: false, price: false, date: false});
                                        }}
                                    >Default
                                    </button>
                                    <button
                                        className={`block w-full text-left px-3 py-2 hover:bg-gray-100 ${priceSort === "asc" ? "font-semibold" : ""}`}
                                        onClick={() => {
                                            setPriceSort("asc");
                                            setDateSort("none");
                                            setOpenMenu({category: false, price: false, date: false});
                                        }}
                                    >Low → High
                                    </button>
                                    <button
                                        className={`block w-full text-left px-3 py-2 hover:bg-gray-100 ${priceSort === "desc" ? "font-semibold" : ""}`}
                                        onClick={() => {
                                            setPriceSort("desc");
                                            setDateSort("none");
                                            setOpenMenu({category: false, price: false, date: false});
                                        }}
                                    >High → Low
                                    </button>
                                </Menu>
                            </th>

                            {/*expiry date with a sorting function*/}
                            <th className="th-menu"
                                style={{
                                    padding: "12px",
                                    textAlign: "center",
                                    borderBottom: "2px solid #e2e8f0",
                                    position: "relative",
                                    cursor: "pointer"
                                }}
                                onClick={() => setOpenMenu({category: false, price: false, date: !openMenu.date})}
                                title="Sort by due date"
                            >Expiry Date ▾
                                <Menu open={openMenu.date}>
                                    <button
                                        className={`block w-full text-left px-3 py-2 hover:bg-gray-100 ${dateSort === "none" ? "font-semibold" : ""}`}
                                        onClick={() => {
                                            setDateSort("none");
                                            setPriceSort("none");
                                            setOpenMenu({category: false, price: false, date: false});
                                        }}
                                    >Default
                                    </button>
                                    <button
                                        className={`block w-full text-left px-3 py-2 hover:bg-gray-100 ${dateSort === "asc" ? "font-semibold" : ""}`}
                                        onClick={() => {
                                            setDateSort("asc");
                                            setPriceSort("none");
                                            setOpenMenu({category: false, price: false, date: false});
                                        }}
                                    >Soonest → Latest
                                    </button>
                                    <button
                                        className={`block w-full text-left px-3 py-2 hover:bg-gray-100 ${dateSort === "desc" ? "font-semibold" : ""}`}
                                        onClick={() => {
                                            setDateSort("desc");
                                            setPriceSort("none");
                                            setOpenMenu({category: false, price: false, date: false});
                                        }}
                                    >Latest → Soonest
                                    </button>
                                </Menu>
                            </th>
                            <th style={{
                                padding: "12px",
                                textAlign: "center",
                                borderBottom: "2px solid #e2e8f0"
                            }}>Action
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredItems.map(item => (
                            <tr key={item._id} style={{
                                textAlign: "center"
                            }}>
                                <td>{item.category || "-"}</td>
                                <td>
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={""} style={{
                                            width: 80,
                                            height: 80,
                                            objectFit: "cover",
                                            borderRadius: 6
                                        }}/>
                                    ) : (" - ")}
                                </td>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>{Number(item.price ?? 0).toFixed(2)}</td>
                                <td>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "-"}</td>
                                <td>
                                    <button onClick={() => navigate(`update/${item._id}`)} style={{
                                        marginRight: "6px",
                                        padding: "6px 12px",
                                        border: "none",
                                        borderRadius: "4px",
                                        backgroundColor: "#407bda",
                                        color: "white",
                                        cursor: "pointer"
                                    }}>Update
                                    </button>
                                    <button onClick={() => handleDeleteItem(item._id)} style={{
                                        padding: "6px 12px",
                                        border: "none",
                                        borderRadius: "4px",
                                        backgroundColor: "#ef4444",
                                        color: "white",
                                        cursor: "pointer"
                                    }}>Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        {/*/!* Add Item button*!/*/}
                        {/*<tfoot>*/}
                        {/*<tr>*/}
                        {/*    <td colSpan={7} style={{ textAlign: "center", padding: "12px" }}>*/}
                        {/*        <button onClick={() => navigate("addItem")} style={{*/}
                        {/*            padding: "8px 16px",*/}
                        {/*            border: "none",*/}
                        {/*            borderRadius: "6px",*/}
                        {/*            backgroundColor: "#10b981",*/}
                        {/*            color: "white",*/}
                        {/*            fontWeight: "500",*/}
                        {/*            cursor: "pointer"*/}
                        {/*        }}>Add Item</button>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {/*</tfoot>*/}
                    </table>
                </div>
            }/>

            {/*Update item page*/}
            <Route path="update/:id" element={
                <UpdateItem onUpdate={handleUpdateItem} onCancel={() => navigate("/fridge")}/>
            }/>

            {/*/!* Add Item page *!/*/}
            {/*<Route path="addItem" element={*/}
            {/*    <div>*/}
            {/*        <AddItem onAdd={handleAddItem} />*/}
            {/*        <button onClick={() => navigate("/item-management")}>Back</button>*/}
            {/*    </div>*/}
            {/*} />*/}
        </Routes>
    );

}