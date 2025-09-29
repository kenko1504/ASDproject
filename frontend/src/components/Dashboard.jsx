import {useState, useEffect} from "react";
import AddButton from "./DashboardComponent/AddButton";
import {Link} from "react-router-dom";

export default function Dashboard() {
    const [budget, setBudget] = useState(500); // default budget
    const [budgetStats, setBudgetStats] = useState({totalValue: 0, count: 0});

    //read total budget from localStorage
    useEffect(() => {
        const savedBudget = localStorage.getItem("budget");
        if (savedBudget) {
            setBudget(Number(savedBudget));
        }
    }, []);

    //listen localStorage to update total budget when it is changed
    useEffect(() => {
        const handleStorageChange = () => {
            const savedBudget = localStorage.getItem("budget");
            if (savedBudget) {
                setBudget(Number(savedBudget));
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    //get total budget
    useEffect(() => {
        fetch("http://localhost:5000/items/stats/budget")
            .then((res) => res.json())
            .then((data) => setBudgetStats(data))
            .catch((err) => console.error("Error fetching budget stats:", err));
    }, []);

    const spent = budgetStats.totalValue;
    const remaining = Math.max(budget - spent, 0); // avoid negative

    return (
        <div className="dashboard w-full">
            {/* Your dashboard content here */}
            <div className="!pt-5"></div>
            <span className="title font-semibold text-4xl">Dashboard</span>
            <section className="card bg-[#D5FAB8] !p-4 !m-4 !mt-10 rounded-lg h-1/4">
                <div className="flex items-center w-full relative">
                    <h2 className="text-2xl font-medium">Fridge Overview</h2>
                    <Link to="/fridge" className="absolute top-0 right-0 border-3 !pl-4 !pr-4 rounded-full border-[#A6C78A] hover:bg-[#A6C78A] transition">
                        <p>View Fridge</p>
                    </Link>
                </div>
            </section>

            <section className="card bg-[#D5FAB8] !p-4 !m-4 !mt-8 rounded-lg h-1/4">
                <div className="flex items-center w-full relative">
                    <h2 className="text-2xl font-medium">Recent Recipes</h2>
                    <Link to="/" className="absolute top-0 right-0 border-3 !pl-4 !pr-4 rounded-full border-[#A6C78A] hover:bg-[#A6C78A] transition">
                        <p>View Recipes</p>
                    </Link>
                </div>
            </section>

            <section className="flex w-full h-1/4 !mt-8">
                <section className="card bg-[#D5FAB8] !p-4 !m-4 !mt-0 rounded-lg w-1/2">
                    <div className="flex items-center w-full relative">
                        <h2 className="text-2xl font-medium">Weekly Nutrition</h2>
                        <Link to="/" className="absolute top-0 right-0 border-3 !pl-4 !pr-4 rounded-full border-[#A6C78A] hover:bg-[#A6C78A] transition">
                            <p>View Nutrition</p>
                        </Link>
                    </div>
                </section>

                {/*Weekly budget*/}
                <section className="card bg-[#D5FAB8] !p-4 !m-4 !mt-0 rounded-lg w-1/2">
                    <div className="flex items-center w-full relative">
                        <h2 className="text-2xl font-medium">Weekly Budget</h2>
                        <Link to="/waste-budget" className="absolute top-0 right-0 border-3 !pl-4 !pr-4 rounded-full border-[#A6C78A] hover:bg-[#A6C78A] transition">
                            <p>View Budget</p>
                        </Link>
                    </div>
                    {/*Budget info*/}
                    <br/>
                    <div className="mt-4 text-lg">
                        <p style={{color: "#2563eb"}}>
                            <strong>Total Budget:</strong> ${budget}
                        </p>
                        <p style={{color: "#dc2626"}}>
                            <strong>Spent:</strong> ${spent}
                        </p>
                        <p style={{color: "#16a34a"}}>
                            <strong>Remaining:</strong> ${remaining}
                        </p>
                    </div>
                </section>
            </section>


            <AddButton/>
        </div>
    );
}
