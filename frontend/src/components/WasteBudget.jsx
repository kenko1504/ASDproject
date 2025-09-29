import { useState, useEffect } from "react";
import "../CSS/index.css";

export default function WasteBudget({ items }) {
    const [budget, setBudget] = useState(500);
    const [budgetStats, setBudgetStats] = useState({totalValue: 0, count: 0});
    const [wasteStats, setWasteStats] = useState({expired: [], expiringSoon: [], wastedValue: 0});

    //read total budget from localStorage
    useEffect(() => {
        const savedBudget = localStorage.getItem("budget");
        if (savedBudget) {
            setBudget(Number(savedBudget));
        }
    }, []);

    //get budget and waste statistics
    useEffect(() => {
        fetch("http://localhost:5000/items/stats/budget")
            .then(res => res.json())
            .then(data => setBudgetStats(data));

        fetch("http://localhost:5000/items/stats/waste")
            .then(res => res.json())
            .then(data => setWasteStats(data));
    }, [items]);

    //update sate and localStorage after updating total budget
    const handleBudgetChange = (e) => {
        const newBudget = Number(e.target.value);
        setBudget(newBudget);
        localStorage.setItem("budget", newBudget); // save localStorage to the browser
    };

    const overBudget = budgetStats.totalValue > budget;

    return (
        <div className="content roboto" style={{maxWidth: "900px", margin: "30px auto"}}>
            <h2 className={"justify-self-center text-3xl font-bold text-gray-800"} style={{
                textAlign: "center",
                marginBottom: "20px"
            }}>Waste and Budget Controller</h2>

            <div style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                marginBottom: "30px"
            }}>
                <h3 style={{marginBottom: "15px", fontSize: "20px", fontWeight: "600", color: "#374151"}}>
                    Budget Control
                </h3>
                <p><b>Total Value:</b> ${budgetStats.totalValue.toFixed(2)}</p>
                <p><b>Total Items:</b> {budgetStats.count}</p>

                <div style={{marginTop: "10px"}}>
                    <label><b>Budget ($):</b></label>
                    <input
                        type="number"
                        value={budget}
                        onChange={handleBudgetChange} // update total budget after changed
                        style={{
                            marginLeft: "10px",
                            padding: "6px 10px",
                            border: "1px solid #ccc",
                            borderRadius: "6px"
                        }}
                    />
                </div>

                <p style={{marginTop: "10px", fontWeight: "500", color: overBudget ? "red" : "green"}}>
                    {overBudget ? "✘ Over Budget!" : "✔ Within Budget"}
                </p>
            </div>


            <div style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}>
                <h3 style={{marginBottom: "15px", fontSize: "20px", fontWeight: "600", color: "#374151"}}>
                    Waste Control
                </h3>

                {/* Expired */}
                <h4 style={{color: "#dc2626", marginTop: "15px"}}>Expired Items</h4>
                {wasteStats.expired.length > 0 ? (
                    <table style={{width: "100%", marginTop: "10px", borderCollapse: "collapse"}}>
                        <thead>
                        <tr style={{background: "#fee2e2"}}>
                            <th style={{padding: "8px", borderBottom: "1px solid #ccc"}}>Name</th>
                            <th style={{padding: "8px", borderBottom: "1px solid #ccc"}}>Expiry Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {wasteStats.expired.map(i => (
                            <tr key={i._id} style={{textAlign: "center"}}>
                                <td style={{padding: "8px"}}>{i.name}</td>
                                <td style={{padding: "8px"}}>{new Date(i.expiryDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : <p>No expired items</p>}

                {/* Expiring Soon */}
                <h4 style={{color: "#f59e0b", marginTop: "20px"}}>Expiring Soon (within 3 days)</h4>
                {wasteStats.expiringSoon.length > 0 ? (
                    <table style={{width: "100%", marginTop: "10px", borderCollapse: "collapse"}}>
                        <thead>
                        <tr style={{background: "#fef3c7"}}>
                            <th style={{padding: "8px", borderBottom: "1px solid #ccc"}}>Name</th>
                            <th style={{padding: "8px", borderBottom: "1px solid #ccc"}}>Expiry Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {wasteStats.expiringSoon.map(i => (
                            <tr key={i._id} style={{textAlign: "center"}}>
                                <td style={{padding: "8px"}}>{i.name}</td>
                                <td style={{padding: "8px"}}>{new Date(i.expiryDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : <p>No items expiring soon</p>}

                <p style={{marginTop: "20px", fontWeight: "600"}}>
                    😭Total Waste Value: ${wasteStats.wastedValue}
                </p>
            </div>
        </div>
    );
}