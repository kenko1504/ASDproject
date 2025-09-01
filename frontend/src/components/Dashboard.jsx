import AddIngredient from "./AddIngredient";
import AddButton from "./DashboardComponent/AddButton";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
      <div className="dashboard flex-1">
          {/* Your dashboard content here */}
          <span className="title text-bold text-4xl">Dashboard</span>
          <section className="card bg-[#d9f7d9] p-15 m-10 mt-0 rounded-10">
              <h2>Fridge Overview</h2>
              <Link to="/fridge">
                  <button>View Fridge</button>
              </Link> // jump to fridge overview page
          </section>

          <section className="card bg-[#d9f7d9] p-15 m-10 mt-0 rounded-10">
              <h2>Recipes</h2>
          </section>

          <section className="card bg-[#d9f7d9] p-15 m-10 mt-0 rounded-10">
              <h2>Weekly Nutrition</h2>
          </section>

          <section className="card bg-[#d9f7d9] p-15 m-10 mt-0 rounded-10">
              <h2>Weekly Budget</h2>
          </section>
          <AddButton/>
      </div>
  );
}
