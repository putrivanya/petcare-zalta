import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaPaw,
} from "react-icons/fa";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  // =====================================================
  // STATE HAMBURGER
  // =====================================================

  const [menuOpen, setMenuOpen] = useState(false);

  // =====================================================
  // CLOSE MENU
  // =====================================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // =====================================================
  // SMOOTH SCROLL
  // =====================================================

  const handleScroll = (e, id) => {
    e.preventDefault();

    closeMenu();

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // =====================================================
  // HOME
  // =====================================================

  const handleHome = () => {
    closeMenu();

    const element = document.getElementById("home");

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      navigate("/");
    }
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = () => {
    closeMenu();
    navigate("/login");
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const handleRegister = () => {
    closeMenu();
    navigate("/register");
  };

  // =====================================================
  // ADOPTION
  // =====================================================

  const handleAdoption = () => {
    closeMenu();
    navigate("/adoption");
  };

  return (
    <nav className={`navbar ${menuOpen ? "menu-open" : ""}`}>

      {/* =================================================
          NAVBAR CONTAINER
          ================================================= */}

      <div className="navbar-container">

        {/* =================================================
            BRAND LOGO
            ================================================= */}

        <Link
          to="/"
          className="navbar-brand"
          onClick={handleHome}
        >

          <span className="brand-icon">
            <FaPaw />
          </span>

          <span className="brand-name">
            PetCare Hub
          </span>

        </Link>

        {/* =================================================
            DESKTOP NAVIGATION
            ================================================= */}

        <ul className="nav-links">

          <li>
            <a
              href="#home"
              onClick={(e) => handleScroll(e, "home")}
            >
              Home
            </a>
          </li>

          <li>
            <a
              href="#layanan"
              onClick={(e) => handleScroll(e, "layanan")}
            >
              Layanan
            </a>
          </li>

          <li>
            <a
              href="#tentang"
              onClick={(e) => handleScroll(e, "tentang")}
            >
              Tentang
            </a>
          </li>

          <li>
            <a
              href="#keunggulan"
              onClick={(e) => handleScroll(e, "keunggulan")}
            >
              Keunggulan
            </a>
          </li>

          <li>
            <a
              href="#kontak"
              onClick={(e) => handleScroll(e, "kontak")}
            >
              Kontak
            </a>
          </li>

          <li>
            <button
              type="button"
              className="nav-adoption-link"
              onClick={handleAdoption}
            >
              Adoption
            </button>
          </li>

        </ul>

        {/* =================================================
            DESKTOP AUTH BUTTONS
            ================================================= */}

        <div className="auth-buttons">

          <button
            type="button"
            className="btn btn-login"
            onClick={handleLogin}
          >
            Login
          </button>

          <button
            type="button"
            className="btn btn-register"
            onClick={handleRegister}
          >
            Register
          </button>

        </div>

        {/* =================================================
            HAMBURGER BUTTON
            ================================================= */}

        <button
          type="button"
          className="navbar-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={
            menuOpen
              ? "Tutup menu navigasi"
              : "Buka menu navigasi"
          }
          aria-expanded={menuOpen}
        >

          {menuOpen ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}

        </button>

      </div>

      {/* =================================================
          MOBILE MENU
          ================================================= */}

      <div
        className={`mobile-menu ${
          menuOpen ? "mobile-menu-active" : ""
        }`}
      >

        {/* HOME */}

        <button
          type="button"
          className="mobile-nav-link"
          onClick={(e) => handleScroll(e, "home")}
        >
          Home
        </button>

        {/* LAYANAN */}

        <button
          type="button"
          className="mobile-nav-link"
          onClick={(e) => handleScroll(e, "layanan")}
        >
          Layanan
        </button>

        {/* TENTANG */}

        <button
          type="button"
          className="mobile-nav-link"
          onClick={(e) => handleScroll(e, "tentang")}
        >
          Tentang
        </button>

        {/* KEUNGGULAN */}

        <button
          type="button"
          className="mobile-nav-link"
          onClick={(e) => handleScroll(e, "keunggulan")}
        >
          Keunggulan
        </button>

        {/* KONTAK */}

        <button
          type="button"
          className="mobile-nav-link"
          onClick={(e) => handleScroll(e, "kontak")}
        >
          Kontak
        </button>

        {/* ADOPTION */}

        <button
          type="button"
          className="mobile-nav-link"
          onClick={handleAdoption}
        >
          Adoption
        </button>

        {/* =================================================
            MOBILE AUTH
            ================================================= */}

        <div className="mobile-auth-buttons">

          <button
            type="button"
            className="mobile-login"
            onClick={handleLogin}
          >
            Login
          </button>

          <button
            type="button"
            className="mobile-register"
            onClick={handleRegister}
          >
            Register
          </button>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;