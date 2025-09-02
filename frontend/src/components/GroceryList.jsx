import "../CSS/index.css";

export default function GroceryList() {
    
    return (
        <div className="w-full h-screen flex items-center flex-col bg-red-50 !px-3 !py-3 rounded-2xl shadow-md">
            <h1 className="justify-self-center text-3xl font-bold text-gray-800">Grocery List</h1>
            <div className="grid grid-cols-3 w-full !mb-3">
                <label for="GroceryListName">
                    name:
                    <input type="text"
                    className="ml-2 p-1 border border-gray-300 rounded" 
                    placeholder="Item name..." />
                </label>
                <label>date:
                    <input type="date" className="ml-2 p-1 border border-gray-300 rounded" placeholder="Date..." />
                </label>
                <button className="justify-self-start !px-3 !py-1 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">Add</button> 
                
            </div>
            <div className="grid grid-cols-[5fr_1fr_1fr] w-full !mb-3">
                <div className="bg-white !px-1 !py-1">
                    <label>
                        Search:
                        <input type="text" className="ml-2 p-1 border border-gray-300 rounded" placeholder="Search items..." />
                    </label>
                    <button className="justify-self-start !px-3 !py-1 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">Search</button>
                </div>
                <div className="bg-blue-100">Filter</div>
                <div className="bg-green-100">Sort Date Desc</div>
            </div>

            <table className="min-w-full border border-gray-300 bg-white">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Name</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Action</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="px-4 py-2 border-b">Birthday Party Run</td>
                    <td className="px-4 py-2 border-b">09-05-2025</td>
                    <td className="px-4 py-2 border-b">Ongoing</td>
                    <td className="px-4 py-2 border-b">Edit/Delete</td>
                </tr>
                <tr>
                    <td className="px-4 py-2 border-b">Apples</td>
                    <td className="px-4 py-2 border-b">6</td>
                    <td className="px-4 py-2 border-b">Fruit</td>
                    <td className="px-4 py-2 border-b">2025-09-10</td>
                </tr>
                {/* Add more rows as needed */}
                </tbody>
            </table>    
        </div>

    );
}