import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Kolom 1: Brand Info */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <span className="brand-icon">🐾</span>
            <span className="brand-name">PetCare Hub</span>
          </div>
          <p className="brand-desc">
            Platform perawatan dan layanan hewan peliharaan terpercaya. Solusi praktis untuk kebutuhan anabul kesayangan Anda.
          </p>
        </div>

        {/* Kolom 2: Navigasi Cepat */}
        <div className="footer-col">
          <h4 className="footer-title">Layanan</h4>
          <ul className="footer-links">
            <li><Link to="/grooming">Pet Grooming</Link></li>
            <li><Link to="/doctor">Dokter Hewan</Link></li>
            <li><Link to="/hotel">Pet Hotel</Link></li>
            <li><Link to="/shop">Pet Shop</Link></li>
            <li><Link to="/adoption">Adopsi</Link></li>
          </ul>
        </div>

        {/* Kolom 3: Informasi Kontak */}
        <div className="footer-col">
          <h4 className="footer-title">Kontak</h4>
          <ul className="footer-contact">
            <li>📍 Jl. PetCare Hub No. 123, Jakarta</li>
            <li>📞 (021) 555-0199</li>
            <li>💬 0812-3456-7890 (WA)</li>
            <li>✉️ info@petcarehub.com</li>
          </ul>
        </div>

        {/* Kolom 4: Media Sosial */}
        <div className="footer-col">
          <h4 className="footer-title">Ikuti Kami</h4>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon">📷</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">📘</a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="social-icon">🎵</a>
          </div>
        </div>
      </div>

      {/* Line Copyright */}
      <div className="footer-bottom">
        <p>&copy; 2026 PetCare Hub. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;