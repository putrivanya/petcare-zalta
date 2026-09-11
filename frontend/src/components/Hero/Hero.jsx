import React from 'react';
import './Hero.css';

function Hero() {
  // Menggunakan URL gambar langsung dari internet
  const imageUrl = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop";

  return (
    <section className="hero">
      {/* Bagian Kiri */}
      <div className="hero-left">
        <div className="hero-subtitle">
          <span>🐾</span> Welcome to PetCare Hub
        </div>
        
        <h1 className="hero-title">
          Semua Kebutuhan <br />
          <span className="text-highlight">Hewan Kesayangan</span> <br />
          Dalam Satu Tempat
        </h1>
        
        <p className="hero-description">
          PetCare Hub menyediakan layanan Grooming, Dokter Hewan, Pet Hotel,
          Pet Shop, dan Adopsi untuk memberikan perawatan terbaik bagi hewan
          kesayangan Anda.
        </p>
      </div>

      {/* Bagian Kanan */}
      <div className="hero-right">
        <img
          src={imageUrl}
          alt="PetCare Hub Cat"
          className="hero-image"
        />
      </div>
    </section>
  );
}

export default Hero;