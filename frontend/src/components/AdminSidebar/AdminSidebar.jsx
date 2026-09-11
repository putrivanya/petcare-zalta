import "./AdminSidebar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaStethoscope,
  FaCut,
  FaHotel,
  FaPaw,
  FaClipboardList,
  FaMoneyCheckAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const menu = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/admin",
    },
    {
      name: "Kelola User",
      icon: <FaUsers />,
      path: "/admin/users",
    },
    {
      name: "Produk",
      icon: <FaBoxOpen />,
      path: "/admin/products",
    },
    {
      name: "Dokter",
      icon: <FaStethoscope />,
      path: "/admin/doctors",
    },
    {
      name: "Grooming",
      icon: <FaCut />,
      path: "/admin/grooming",
    },
    {
      name: "Hotel",
      icon: <FaHotel />,
      path: "/admin/hotel",
    },
    {
      name: "Adopsi",
      icon: <FaPaw />,
      path: "/admin/adoption",
    },
    {
      name: "Booking",
      icon: <FaClipboardList />,
      path: "/admin/booking",
    },
    {
      name: "Pembayaran",
      icon: <FaMoneyCheckAlt />,
      path: "/admin/payment",
    },
    {
      name: "Pengaturan",
      icon: <FaCog />,
      path: "/admin/settings",
    },
  ];

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">

        <div className="logo-circle">
          🐾
        </div>

        <div>

          <h2>PetCare</h2>

          <span>Admin Panel</span>

        </div>

      </div>

      <nav>

        {menu.map((item) => (

          <Link
            key={item.path}
            to={item.path}
            className={
              location.pathname === item.path
                ? "menu active"
                : "menu"
            }
          >
            {item.icon}

            <span>{item.name}</span>

          </Link>

        ))}

      </nav>

      <button
        className="logout"
        onClick={logout}
      >
        <FaSignOutAlt />

        Logout
      </button>

    </aside>
  );
}

export default AdminSidebar;