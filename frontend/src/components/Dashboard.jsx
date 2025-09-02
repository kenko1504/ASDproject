import AddIngredient from "./AddIngredient";
import AddButton from "./DashboardComponent/AddButton";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
      <div className="dashboard">
          {/* Your dashboard content here */}
          <span className="title text-bold text-4xl">Dashboard</span>
          <section className="card bg-[#D5FAB8] !p-4 !m-4 !mt-0 rounded-lg">
              <h2>Fridge Overview</h2>
              <Link to="/fridge">
                  <button>View Fridge</button>
              </Link> // jump to fridge overview page
          </section>

          <section className="card bg-[#D5FAB8] !p-4 !m-4 !mt-0 rounded-lg">
              <h2>Recipes</h2>
          </section>

          <section className="card bg-[#D5FAB8] !p-4 !m-4 !mt-0 rounded-lg">
              <h2>Weekly Nutrition</h2>
          </section>

          <section className="card bg-[#D5FAB8] !p-4 !m-4 !mt-0 rounded-lg">
              <h2>Weekly Budget</h2>
          </section>
          <AddButton/>
      </div>
  );
}
