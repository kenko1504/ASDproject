function NavBar() {

  return (
    <>
      <div className="container fixed top-0 left-0 z-40 w-64 h-screen">
        <div className="sidebar">
          <div className="Logo">
            <img src="#" alt="FridgeManager Logo" />
            <h1>FridgeManager</h1>
          </div>
          <div className="menuItems">
            <ul>
            <li><a href="/itemManagement">Your Fridge</a></li>
            <li><a href="/nutritions">Your Nutritions</a></li>
            <li><a href="/wasteManagement">Waste and Budget Control</a></li>
            <li><a href="/recipes">Your Recipes</a></li>
          </ul>
          </div>
          <div className="userPrefElements">
                <div className="upper">
                  <button className="signOut"><svg></svg></button>
                  <button className="settings"><svg></svg></button>
                </div>
                <div className="lower">
                  <button className="notification"><svg></svg></button>
                  <button className="profile"><img src="#" alt="Profile Pic" /><span>{/* User Name */}</span></button>
                </div>
          </div>

        </div>

        <div className="dashboard">
          <h2>Dashboard</h2>
          {/* Your dashboard content here */}
        </div>
      </div>
    </>
  )
}
export default NavBar