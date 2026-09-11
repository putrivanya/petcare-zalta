import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-icon">🐾</span>
              <span className="footer-logo-text">pet kingdom</span>
              <span className="footer-logo-tm">™</span>
            </div>
            <p className="footer-desc">
              Pet Kingdom — Tempat terbaik untuk semua kebutuhan hewan peliharaan Anda.
              Dari makanan, aksesoris, hingga layanan perawatan profesional.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link">📱</a>
              <a href="#" className="social-link">📷</a>
              <a href="#" className="social-link">▶️</a>
              <a href="#" className="social-link">🐦</a>
            </div>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4 className="footer-col-title">Tentang</h4>
              <Link to="/about" className="footer-col-link">Tentang Kami</Link>
              <Link to="/careers" className="footer-col-link">Karir</Link>
              <Link to="/blog" className="footer-col-link">Blog</Link>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Layanan</h4>
              <Link to="/grooming" className="footer-col-link">Grooming</Link>
              <Link to="/veteriner" className="footer-col-link">Veteriner</Link>
              <Link to="/pet-hotel" className="footer-col-link">Pet Hotel</Link>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Bantuan</h4>
              <Link to="/faq" className="footer-col-link">FAQ</Link>
              <Link to="/privacy" className="footer-col-link">Kebijakan Privasi</Link>
              <Link to="/terms" className="footer-col-link">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Pet Kingdom. All rights reserved.</span>
          <span>Activate Windows · Go to Settings to activate Windows.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;