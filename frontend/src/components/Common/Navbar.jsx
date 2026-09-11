import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [navItems, setNavItems] = useState([
    'Brands', 'Layanan', 'Rewards', 'Berita Terbaru', 'Produk', 'Belanja Online'
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount] = useState(3);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/dashboard');
        const data = await res.json();
        if (data && data.navItems) {
          setNavItems(data.navItems);
        }
      } catch (error) {
        console.log('Navbar: menggunakan data default');
      }
    };
    fetchNav();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🐾</span>
          <span className="logo-text">pet kingdom</span>
          <span className="logo-tm">™</span>
        </Link>

        <nav className="navbar-nav">
          {navItems.map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase().replace(/\s/g, '-')}`}
              className={`nav-link ${window.location.pathname.includes(item.toLowerCase().replace(/\s/g, '-')) ? 'active' : ''}`}
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="navbar-actions">
          <form onSubmit={handleSearch} className="search-form">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Mencari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </form>

          <Link to="/cart" className="cart-btn">
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            ☰
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase().replace(/\s/g, '-')}`}
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;