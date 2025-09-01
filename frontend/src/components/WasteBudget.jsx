import { useState, useEffect } from "react";

export default function WasteBudget({ items }) {
    const [budget, setBudget] = useState(500);
    const [budgetStats, setBudgetStats] = useState({totalValue: 0, count: 0});
    const [wasteStats, setWasteStats] = useState({expired: [], expiringSoon: [], wastedValue: 0});

    useEffect(() => {
        fetch("http://localhost:5000/items/stats/budget")
            .then(res => res.json())
            .then(data => setBudgetStats(data));

        fetch("http://localhost:5000/items/stats/waste")
            .then(res => res.json())
            .then(data => setWasteStats(data));
    }, [items]);

    const overBudget = budgetStats.totalValue > budget;

    return (
        <div>
            <h1>Waste and Budget Controller</h1>

            {/* Budget Section */}
            <h2>Budget Control</h2>
            <p>Total Value: ${budgetStats.totalValue}</p>
            <p>Total Items: {budgetStats.count}</p>
            <label>
                Budget:
                <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                />
            </label>
            {overBudget
                ? <p style={{ color: "red" }}>Over Budget!</p>
                : <p>Within Budget</p>}

            {/* Waste Section */}
            <h2>Waste Control</h2>
            <h3>Expired Items</h3>
            {wasteStats.expired.length > 0 ? (
                <ul>
                    {wasteStats.expired.map(i => (
                        <li key={i._id}>
                            {i.name} - expired on {new Date(i.expiryDate).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            ) : <p>No expired items</p>}

            <h3>Expiring Soon (within 3 days)</h3>
            {wasteStats.expiringSoon.length > 0 ? (
                <ul>
                    {wasteStats.expiringSoon.map(i => (
                        <li key={i._id}>
                            {i.name} - will expire on {new Date(i.expiryDate).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            ) : <p>No items expiring soon</p>}

            <p>Total Waste Value: ${wasteStats.wastedValue}</p>
        </div>
    );
}