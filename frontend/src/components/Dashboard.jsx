import {useState, useContext, useEffect, useCallback, useRef} from "react";
import {AuthContext} from "../contexts/AuthContext.jsx";

import {Link} from "react-router-dom";
import RecipeCard from "./RecipeCard.jsx";

import { API_BASE_URL } from '../utils/api.js';
export default function Dashboard() {
    const {user} = useContext(AuthContext);
    const [recentRecipes, setRecentRecipes] = useState([]);

    const [budget, setBudget] = useState(500); // default budget
    const [budgetStats, setBudgetStats] = useState({totalValue: 0, count: 0});

    // Fetch all recently viewed recipes
    const fetchRecentRecipes = async () => {
        if (!user?._id) {
            setRecentRecipes([]);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/users/${user._id}/recent-recipes`);
            if (response.ok) {
                const data = await response.json();
                setRecentRecipes(data);
            } else {
                console.error('Failed to fetch recent recipes:', response.status);
                setRecentRecipes([]);
            }
        } catch (error) {
            console.error('Error fetching recent recipes: ', error);
            setRecentRecipes([]);
        }
    };

    useEffect(() => {
        fetchRecentRecipes();
    }, [user?._id]);

    //Fridge Overview
    const [ingredients, setIngredients] = useState([]);
    const railRef = useRef(null);
    const [sliderMax, setSliderMax] = useState(0);
    const [sliderVal, setSliderVal] = useState(0);

    const fetchIngredients = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setIngredients([]);
                return;
            }
            const res = await fetch(`${API_BASE_URL}/ingredients`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("token");
                setIngredients([]);
                return;
            }
            const list = await res.json();
            setIngredients(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error("Error fetching ingredients:", err);
            setIngredients([]);
        }
    }, []);

    useEffect(() => {
        fetchIngredients();
    }, [fetchIngredients]);

    // calculate the max value of slider
    useEffect(() => {
        const el = railRef.current;
        if (!el) return;
        const refreshMax = () => {
            const max = Math.max(el.scrollWidth - el.clientWidth, 0);
            setSliderMax(max);
            setSliderVal(el.scrollLeft);
        };
        refreshMax();
        window.addEventListener("resize", refreshMax);
        return () => window.removeEventListener("resize", refreshMax);
    }, [ingredients.length]);


    const onRailScroll = () => {
        const el = railRef.current;
        if (!el) return;
        setSliderVal(el.scrollLeft);
    };


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

    //round the number to 2 decimals
    const round2decimals = (n) => Math.round((Number(n) || 0) * 100) / 100;

    const fetchBudgetFromIngredients = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setBudgetStats({totalValue: 0, count: 0});
                return;
            }
            const res = await fetch(`${API_BASE_URL}/ingredients`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("token");
                setBudgetStats({totalValue: 0, count: 0});
                return;
            }

            const list = await res.json();
            const arr = Array.isArray(list) ? list : [];
            const total = round2decimals(
                arr.reduce(
                    (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) / 500.0 || 0), 0
                )
            );
            setBudgetStats({totalValue: total, count: arr.length});
        } catch (err) {
            console.error("Error fetching ingredients:", err);
            setBudgetStats({totalValue: 0, count: 0});
        }
    }, []);

    useEffect(() => {
        fetchBudgetFromIngredients();
    }, [fetchBudgetFromIngredients]);

    //refresh the page when add/delete/update ingredient
    useEffect(() => {
        const refresh = () => fetchBudgetFromIngredients();
        window.addEventListener("ingredients:refresh", refresh);
        return () => window.removeEventListener("ingredients:refresh", refresh);
    }, [fetchBudgetFromIngredients]);


    const spent = Number(budgetStats.totalValue || 0);
    const remaining = Math.max(round2decimals(budget - spent), 0); // avoid negative

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
                <div className="mt-3 mx-auto" style={{maxWidth: 1250}}>
                    <div
                        ref={railRef}
                        onScroll={onRailScroll}
                        className="flex gap-4 overflow-x-auto scroll-smooth px-1 py-2"
                        style={{width: "100%"}}
                    >
                        {ingredients.map((img) => (
                            <div key={img._id} className="flex-shrink-0 w-[150px] text-center">
                                <div className="w-[120px] h-[120px] bg-white rounded-lg flex items-center justify-center overflow-hidden shadow">
                                    {img.imageUrl ? (
                                        <img
                                            src={img.imageUrl}
                                            alt={img.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-sm text-gray-500">No Image</span>
                                    )}
                                </div>
                                <p className="mt-2 text-sm font-medium truncate">{img.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </section>

            <section className="card bg-[#D5FAB8] !p-4 !m-4 !mt-8 rounded-lg h-1/4">
                <div className="flex items-center w-full relative">
                    <h2 className="text-2xl font-medium">Recent Recipes</h2>
                    <Link to="/recipes" className="absolute top-0 right-0 border-3 !pl-4 !pr-4 rounded-full border-[#A6C78A] hover:bg-[#A6C78A] transition">
                        <p>View Recipes</p>
                    </Link>
                </div>

                {/* Recently Viewed Recipes */}
                <div className="h-11/12 w-full flex flex-row overflow-x-auto overflow-y-hidden !pb-4">
                    {recentRecipes.length === 0 ? (
                        <div className="w-full flex justify-center items-center">
                            <p className="text-lg !px-4 !py-2 rounded-lg bg-[#E5F3DA] border-[#A6C78A] border-3 border-dashed w-fit">
                                No recipes viewed.
                            </p>
                        </div>
                    ) : (
                        recentRecipes.map((recipe) => (
                            <div key={recipe._id} className="flex-shrink-0 !mr-4 last:!mr-0 h-full">
                                <RecipeCard
                                    recipe={recipe}
                                    isDashboard={true}
                                />
                            </div>
                        ))
                    )}
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

        </div>
    );
}
