import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      {/* Brand Logo */}
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">🐾</span>
        <span className="brand-name">PetCare Hub</span>
      </Link>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li><a href="#home" onClick={(e) => handleScroll(e, 'home')}>Home</a></li>
        <li><a href="#layanan" onClick={(e) => handleScroll(e, 'layanan')}>Layanan</a></li>
        <li><a href="#tentang" onClick={(e) => handleScroll(e, 'tentang')}>Tentang</a></li>
        <li><a href="#keunggulan" onClick={(e) => handleScroll(e, 'keunggulan')}>Keunggulan</a></li>
        <li><a href="#kontak" onClick={(e) => handleScroll(e, 'kontak')}>Kontak</a></li>
        <li><Link to="/adoption">Adoption</Link></li>
      </ul>

      {/* Action Buttons */}
      <div className="auth-buttons">
        <button 
          type="button" 
          className="btn btn-login" 
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button 
          type="button" 
          className="btn btn-register" 
          onClick={() => navigate('/register')}
        >
          Register
        </button>
      </div>
    </nav>
  );
}

export default Navbar;