import "./AdminTopbar.css";
import { FaBell, FaSearch } from "react-icons/fa";

function AdminTopbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const today = new Date();

  const tanggal = today.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="topbar">

      <div className="topbar-left">

        <h1>Dashboard</h1>

        <p>{tanggal}</p>

      </div>

      <div className="topbar-right">

        <div className="search-box">

          <FaSearch />

          <input
            type="text"
            placeholder="Cari data..."
          />

        </div>

        <div className="notification">

          <FaBell />

          <span>3</span>

        </div>

        <div className="profile">

          <img
            src="https://ui-avatars.com/api/?name=Admin&background=4CAF50&color=fff"
            alt="Admin"
          />

          <div>

            <h4>{user?.nama}</h4>

            <p>{user?.role}</p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminTopbar;