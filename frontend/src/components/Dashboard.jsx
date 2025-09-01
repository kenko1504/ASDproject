import AddIngredient from "./AddIngredient";
import AddButton from "./DashboardComponent/AddButton";
import {Link} from "react-router-dom";
export default function Dashboard() {
  return (
      <div className="dashboard">
          {/* Your dashboard content here */}
          <h1>Dashboard</h1>
          <section className="card">
              <h2>Fridge Overview</h2>
              <Link to="/fridge">
                  <button>View Fridge</button>
              </Link> // jump to fridge overview page
          </section>

          <section className="card">
              <h2>Recipes</h2>
          </section>

          <section className="card">
              <h2>Weekly Nutrition</h2>
          </section>

          <section className="card">
              <h2>Weekly Budget</h2>
          </section>
          <AddButton/>
      </div>
  );
}
