import { useState, useEffect, useCallback} from "react";
import "../CSS/index.css";

export default function WasteBudget() {
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

    // Helper to round to 2 decimals reliably
    const round2decimals = (n) => Math.round((Number(n) || 0) * 100) / 100;

    const fetchWasteBudget = useCallback(async () => {
        try{
            const token = localStorage.getItem("token");
            if (!token) {
                setBudgetStats({ totalValue: 0, count: 0 });
                setWasteStats({ expired: [], expiringSoon: [], wastedValue: 0 });
                return;
            }
            const res = await fetch("http://localhost:5000/ingredients", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 401 || res.status === 403) {
                // Not authenticated or token expired
                localStorage.removeItem("token");
                setBudgetStats({ totalValue: 0, count: 0 });
                setWasteStats({ expired: [], expiringSoon: [], wastedValue: 0 });
                return;
            }

            const ingredients = await res.json();
            const list = Array.isArray(ingredients) ? ingredients : [];


            //Calculate Budget Stats
            const totalValueRaw = list.reduce(
                (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) / 500.0 || 0), 0
            );
            const totalValue = round2decimals(totalValueRaw);
            setBudgetStats({ totalValue, count: list.length });


            //Calculate Waste Stats
            const now = new Date();
            const soon = new Date();
            soon.setDate(now.getDate() + 3); // expiring soon in 3 days

            const withDate = (date) => (date ? new Date(date) : null);

            const expired = list.filter((i) => {
                const date = withDate(i.expiryDate);
                return date && date < now;
            });

            const expiringSoon = list.filter((i) => {
                const date = withDate(i.expiryDate);
                return date && date >= now && date <= soon;
            });

            const wastedValueRaw = expired.reduce(
                (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) / 500.0 || 0), 0
            );
            const wastedValue = round2decimals(wastedValueRaw);

            setWasteStats({ expired, expiringSoon, wastedValue });
        }catch (e) {
            console.error("Failed to fetch ingredients:", e);
            // rollback to empty stats on error
            setBudgetStats({ totalValue: 0, count: 0 });
            setWasteStats({ expired: [], expiringSoon: [], wastedValue: 0 });
        }
    },[])

    // Fetch once on mount
    useEffect(() => {
        fetchWasteBudget();
    }, [fetchWasteBudget]);

    // listen to a global refresh event triggered after add/update/delete
    useEffect(() => {
        const refresh = () => fetchWasteBudget();
        window.addEventListener("ingredients:refresh", refresh);
        return () => window.removeEventListener("ingredients:refresh", refresh);
    }, [fetchWasteBudget]);

    // //get budget and waste statistics
    // useEffect(() => {
    //     fetch("http://localhost:5000/items/stats/budget")
    //         .then(res => res.json())
    //         .then(data => setBudgetStats(data));
    //
    //     fetch("http://localhost:5000/items/stats/waste")
    //         .then(res => res.json())
    //         .then(data => setWasteStats(data));
    // }, [items]);

    //update state and localStorage after updating total budget
    const handleBudgetChange = (e) => {
        const newBudget = Number(e.target.value);
        setBudget(newBudget);
        localStorage.setItem("budget", String(newBudget)); // save localStorage to the browser
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