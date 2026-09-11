import React, { useState } from "react";
import { PawPrint, ChevronDown, ChevronRight, LogOut } from "lucide-react";
import { menuItems } from "./menuConfig";
import "./Sidebar.css";

const Sidebar = ({
  activeMenu,
  onMenuChange,
  notificationCount = 0,
  onLogout,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (id) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isActive = (id) => activeMenu === id;

  return (
    <>
      {isMobileOpen && <div className="sidebar-overlay" onClick={onCloseMobile} />}
      <aside className={`admin-sidebar ${isMobileOpen ? "mobile-open" : ""}`}>
        <div className="admin-brand">
          <div className="brand-paw"><PawPrint size={27} /></div>
          <div>
            <h2>PetCare Hub</h2>
            <span>ZALTA ADMIN</span>
          </div>
        </div>

        <div className="menu-title">MENU UTAMA</div>
        <nav className="sidebar-menu">
          {menuItems.map((menu) => {
            const hasSubmenu = menu.submenus && menu.submenus.length > 0;
            const isOpen = openMenus[menu.id] || false;

            return (
              <div key={menu.id} className="menu-group">
                <button
                  className={`menu-item ${isActive(menu.id) ? "active" : ""}`}
                  onClick={() => {
                    if (hasSubmenu) {
                      toggleMenu(menu.id);
                    } else {
                      onMenuChange(menu.id);
                      if (isMobileOpen) onCloseMobile();
                    }
                  }}
                >
                  <menu.icon size={20} strokeWidth={2} />
                  <span>{menu.name}</span>
                  {hasSubmenu && (
                    <span className="menu-arrow">
                      {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                  )}
                  {menu.id === "transaksi" && notificationCount > 0 && (
                    <b className="notification-count">{notificationCount}</b>
                  )}
                </button>

                {hasSubmenu && isOpen && (
                  <div className="submenu">
                    {menu.submenus.map((sub) => (
                      <button
                        key={sub.id}
                        className={`submenu-item ${isActive(sub.id) ? "active" : ""}`}
                        onClick={() => {
                          onMenuChange(sub.id);
                          if (isMobileOpen) onCloseMobile();
                        }}
                      >
                        <sub.icon size={16} strokeWidth={2} />
                        <span>{sub.name}</span>
                        {sub.id === "pembayaran" && notificationCount > 0 && (
                          <b className="notification-count">{notificationCount}</b>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={19} /> <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;