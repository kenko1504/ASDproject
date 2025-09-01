import {Link} from "react-router-dom";

export default function FridgeList(){
    return (
        <div>
            <h1>Your Refrigerator</h1>

            <Link to="/item-management">
                <button style={{ float: "right" }}>Item Management</button>
            </Link>

            <h2>Fridge</h2>


            <h2>Freezer</h2>

        </div>
    );
}