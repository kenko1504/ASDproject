import AddButton from "./DashboardComponent/AddButton";
import { Link } from "react-router-dom";

export default function Dashboard() {
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
                <h2 className="text-2xl font-medium">Recipes</h2>
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
