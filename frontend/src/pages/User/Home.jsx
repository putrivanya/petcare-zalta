import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaDog, 
  FaCat, 
  FaCrow, 
  FaOtter, 
  FaFish, 
  FaPaperPlane,
  FaArrowRight,
  FaCheckCircle
} from "react-icons/fa";
import { GiTurtle } from "react-icons/gi";

// Import Komponen Modular
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Services from "../../components/Services/Services";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import Footer from "../../components/Footer/Footer";

import "./Home.css";

function Home() {
  const navigate = useNavigate();

  // State Form Konsultasi
  const [consultForm, setConsultForm] = useState({
    name: "",
    petType: "Kucing / Anjing",
    message: "",
  });

  const handleConsultSubmit = (e) => {
    e.preventDefault();
    const waNumber = "6283847622939";
    const text = `Halo Petcare Hub Zalta! Saya ${consultForm.name}.\nHewan: ${consultForm.petType}\nPertanyaan: ${consultForm.message}`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="landing-container" id="home">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <Hero />

      {/* TENTANG SECTION */}
      <section id="tentang" className="landing-section about-section">
        <div className="about-container">
          <div className="about-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=800" 
              alt="Petcare Hub Zalta Service" 
              className="about-image"
            />
            <div className="about-floating-card">
              <span className="number">100%</span>
              <span className="label">Layanan Terpadu<br />Semua Hewan</span>
            </div>
          </div>

          <div className="about-content">
            <span className="section-badge">
              <FaCheckCircle /> Tentang Petcare Hub Radot
            </span>
            <h2 className="section-title">Solusi Kesehatan & Perawatan Terlengkap Untuk Hewan Kesayangan</h2>
            <p className="about-text" style={{ marginTop: '1rem' }}>
              Petcare Hub Zalta adalah platform perawatan hewan modern yang ramah untuk <strong>semua jenis hewan</strong>—mulai dari anjing, kucing, burung/unggas, reptil, ikan aquascape, hingga mamalia kecil.
            </p>
            <p className="about-text">
              Kami menghadirkan fleksibilitas perawatan langsung melalui <strong>Home Service</strong> (kunjungan rumah) maupun di Hub utama kami dengan standar profesionalitas tinggi.
            </p>
            
            <button className="btn-primary" onClick={() => navigate("/register")}>
              Masuk / Daftar Akun Member <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* SHOWCASE KATEGORI HEWAN */}
      <section className="landing-section pet-category-section">
        <div className="section-header-center">
          <span className="section-badge">INKLUSIF & LENGKAP</span>
          <h2 className="section-title">Layanan Spesialis Untuk Semua Spesies</h2>
          <p className="section-description">
            Kami tidak hanya melayani anjing dan kucing, tetapi juga seluruh ekosistem hewan kesayangan Anda.
          </p>
        </div>

        <div className="pet-category-grid">
          <div className="pet-category-card">
            <div className="pet-icon-box">
              <FaDog />
            </div>
            <h3>Anjing & Kucing</h3>
            <p>Grooming medis, steril, pet hotel, & konsultasi gizi.</p>
          </div>

          <div className="pet-category-card">
            <div className="pet-icon-box">
              <FaCrow />
            </div>
            <h3>Burung & Unggas</h3>
            <p>Pembersihan sangkar, trim bulu/kuku, & cek kesehatan.</p>
          </div>

          <div className="pet-category-card">
            <div className="pet-icon-box">
              <GiTurtle />
            </div>
            <h3>Reptil & Ampibi</h3>
            <p>Shedding care, health check, & penataan terarium.</p>
          </div>

          <div className="pet-category-card">
            <div className="pet-icon-box">
              <FaFish />
            </div>
            <h3>Ikan & Aquascape</h3>
            <p>Maintenance akuarium, tes air, & pengobatan ikan.</p>
          </div>

          <div className="pet-category-card">
            <div className="pet-icon-box">
              <FaOtter />
            </div>
            <h3>Mamalia Kecil</h3>
            <p>Kelinci, sugar glider, hamster, & landak mini.</p>
          </div>
        </div>
      </section>

      {/* LAYANAN SECTION */}
      <Services />

      {/* KEUNGGULAN SECTION */}
      <WhyChooseUs />

      {/* FORM KONSULTASI GRATIS (TANPA LOGIN) */}
      <section id="konsultasi" className="landing-section consultation-section">
        <div className="section-header-center">
          <span className="section-badge" style={{ backgroundColor: '#fff3e0', color: '#e67e22' }}>
            BEBAS AKSES (TANPA LOGIN)
          </span>
          <h2 className="section-title">Konsultasi Gratis Dokter Zalta</h2>
          <p className="section-description">
            Ajukan pertanyaan awal atau konsultasi seputar kendala hewan Anda secara instan.
          </p>
        </div>

        <div className="consultation-card">
          <form className="consultation-form" onSubmit={handleConsultSubmit}>
            <div className="consult-grid-2">
              <div className="form-group">
                <label>Nama Pemilik</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Budi Santoso" 
                  required 
                  value={consultForm.name}
                  onChange={(e) => setConsultForm({...consultForm, name: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Kategori Hewan</label>
                <select 
                  value={consultForm.petType}
                  onChange={(e) => setConsultForm({...consultForm, petType: e.target.value})}
                >
                  <option value="Kucing">Kucing</option>
                   <option value="Anjing">Anjing</option>
                  <option value="Burung / Unggas">Burung / Unggas</option>
                  <option value="Reptil / Ampibi">Reptil / Ampibi</option>
                  <option value="Ikan / Aquascape">Ikan / Aquascape</option>
                  <option value="Mamalia Kecil">Mamalia Kecil (Kelinci, Hamster, dll)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Pertanyaan / Keluhan Kesehatan Hewan</label>
              <textarea 
                rows="4" 
                placeholder="Tuliskan keluhan, perilaku aneh, atau pertanyaan perawatan hewan Anda..." 
                required
                value={consultForm.message}
                onChange={(e) => setConsultForm({...consultForm, message: e.target.value})}
              ></textarea>
            </div>

            <button type="submit" className="btn-submit-consult">
              <FaPaperPlane /> Kirim Konsultasi via WhatsApp
            </button>
          </form>
        </div>
      </section>

      {/* KONTAK SECTION */}
      <section id="kontak" className="landing-section contact-section">
        <div className="section-header-center">
          <span className="section-badge">HUBUNGI KAMI</span>
          <h2 className="section-title">Pusat Layanan Hub Zalta</h2>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-icon-wrapper">
              <FaPhoneAlt />
            </div>
            <h3>Telepon / WhatsApp</h3>
            <p>+62 83847622939</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon-wrapper">
              <FaEnvelope />
            </div>
            <h3>Email Support</h3>
            <p>support@petcarezalta.com</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon-wrapper">
              <FaMapMarkerAlt />
            </div>
            <h3>Lokasi Utama Hub</h3>
            <p>Jl. Utama Zalta Petcare No. 88, Jakarta</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default Home;