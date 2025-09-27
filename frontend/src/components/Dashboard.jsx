import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import AddButton from "./DashboardComponent/AddButton";
import { Link } from "react-router-dom";
import RecipeCard from "./RecipeCard.jsx";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [recentRecipes, setRecentRecipes] = useState([]);

  // Fetch all recently viewed recipes
  const fetchRecentRecipes = async () => {
    if (!user?._id) {
      setRecentRecipes([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/${user._id}/recent-recipes`);
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
                      hideAdminButtons={true}
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

            <section className="card bg-[#D5FAB8] !p-4 !m-4 !mt-0 rounded-lg w-1/2">
              <div className="flex items-center w-full relative">
                <h2 className="text-2xl font-medium">Weekly Budget</h2>
                <Link to="/" className="absolute top-0 right-0 border-3 !pl-4 !pr-4 rounded-full border-[#A6C78A] hover:bg-[#A6C78A] transition">
                    <p>View Budget</p>
                </Link>
              </div>
            </section>            
        </section>

          
          <AddButton/>
      </div>
  );
}
