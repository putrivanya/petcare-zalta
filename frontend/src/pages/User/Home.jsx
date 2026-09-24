import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaDog,
  FaCrow,
  FaOtter,
  FaFish,
  FaPaperPlane,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

import { GiTurtle } from "react-icons/gi";

// ======================================================
// IMPORT KOMPONEN MODULAR
// ======================================================

import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Services from "../../components/Services/Services";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import Footer from "../../components/Footer/Footer";

import "./Home.css";

// ======================================================
// HOME
// ======================================================

function Home() {
  const navigate = useNavigate();

  // ====================================================
  // STATE FORM KONSULTASI
  // ====================================================

  const [consultForm, setConsultForm] = useState({
    name: "",
    petType: "Kucing",
    message: "",
  });

  // ====================================================
  // HANDLE INPUT FORM
  // ====================================================

  const handleConsultChange = (e) => {
    const { name, value } = e.target;

    setConsultForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ====================================================
  // HANDLE SUBMIT KONSULTASI
  // ====================================================

  const handleConsultSubmit = (e) => {
    e.preventDefault();

    const waNumber = "6283847622939";

    const text = `Halo PetCare Hub Zalta!

Saya ${consultForm.name}.

Kategori Hewan:
${consultForm.petType}

Pertanyaan / Keluhan:
${consultForm.message}

Terima kasih.`;

    const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
      text
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="landing-container" id="home">

      {/* ==================================================
          NAVBAR
          ================================================== */}

      <Navbar />

      {/* ==================================================
          HERO
          ================================================== */}

      <Hero />

      {/* ==================================================
          TENTANG PETCARE HUB ZALTA
          ================================================== */}

      <section
        id="tentang"
        className="landing-section about-section"
      >
        <div className="about-container">

          {/* GAMBAR */}

          <div className="about-image-wrapper">

            <img
              src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=800"
              alt="PetCare Hub Zalta Service"
              className="about-image"
            />

            <div className="about-floating-card">
              <span className="number">
                100%
              </span>

              <span className="label">
                Layanan Terpadu
                <br />
                Semua Hewan
              </span>
            </div>

          </div>

          {/* KONTEN */}

          <div className="about-content">

            <span className="section-badge">
              <FaCheckCircle />
              Tentang PetCare Hub Zalta
            </span>

            <h2 className="section-title">
              Solusi Kesehatan & Perawatan Terlengkap Untuk Hewan Kesayangan
            </h2>

            <p
              className="about-text"
              style={{ marginTop: "1rem" }}
            >
              PetCare Hub Zalta adalah platform perawatan hewan modern
              yang ramah untuk{" "}
              <strong>semua jenis hewan</strong> — mulai dari
              anjing, kucing, burung/unggas, reptil, ikan aquascape,
              hingga mamalia kecil.
            </p>

            <p className="about-text">
              Kami menghadirkan fleksibilitas perawatan langsung melalui{" "}
              <strong>Home Service</strong> atau kunjungan rumah maupun
              di Hub utama kami dengan standar profesionalitas tinggi.
            </p>

            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate("/register")}
            >
              Masuk / Daftar Akun Member
              <FaArrowRight />
            </button>

          </div>
        </div>
      </section>

      {/* ==================================================
          KATEGORI HEWAN
          ================================================== */}

      <section
        id="kategori-hewan"
        className="landing-section pet-category-section"
      >

        <div className="section-header-center">

          <span className="section-badge">
            INKLUSIF & LENGKAP
          </span>

          <h2 className="section-title">
            Layanan Spesialis Untuk Semua Spesies
          </h2>

          <p className="section-description">
            Kami tidak hanya melayani anjing dan kucing,
            tetapi juga seluruh ekosistem hewan kesayangan Anda.
          </p>

        </div>

        <div className="pet-category-grid">

          {/* ANJING & KUCING */}

          <div className="pet-category-card">

            <div className="pet-icon-box">
              <FaDog />
            </div>

            <h3>
              Anjing & Kucing
            </h3>

            <p>
              Grooming medis, steril, pet hotel,
              & konsultasi gizi.
            </p>

          </div>

          {/* BURUNG */}

          <div className="pet-category-card">

            <div className="pet-icon-box">
              <FaCrow />
            </div>

            <h3>
              Burung & Unggas
            </h3>

            <p>
              Pembersihan sangkar, trim bulu/kuku,
              & cek kesehatan.
            </p>

          </div>

          {/* REPTIL */}

          <div className="pet-category-card">

            <div className="pet-icon-box">
              <GiTurtle />
            </div>

            <h3>
              Reptil & Ampibi
            </h3>

            <p>
              Shedding care, health check,
              & penataan terarium.
            </p>

          </div>

          {/* IKAN */}

          <div className="pet-category-card">

            <div className="pet-icon-box">
              <FaFish />
            </div>

            <h3>
              Ikan & Aquascape
            </h3>

            <p>
              Maintenance akuarium, tes air,
              & pengobatan ikan.
            </p>

          </div>

          {/* MAMALIA KECIL */}

          <div className="pet-category-card">

            <div className="pet-icon-box">
              <FaOtter />
            </div>

            <h3>
              Mamalia Kecil
            </h3>

            <p>
              Kelinci, sugar glider, hamster,
              & landak mini.
            </p>

          </div>

        </div>
      </section>

      {/* ==================================================
          LAYANAN
          ================================================== */}

      <Services />

      {/* ==================================================
          KEUNGGULAN
          ================================================== */}

      <WhyChooseUs />

      {/* ==================================================
          KONSULTASI GRATIS
          ================================================== */}

      <section
        id="konsultasi"
        className="landing-section consultation-section"
      >

        <div className="section-header-center">

          <span
            className="section-badge"
            style={{
              backgroundColor: "#fff3e0",
              color: "#e67e22",
            }}
          >
            BEBAS AKSES (TANPA LOGIN)
          </span>

          <h2 className="section-title">
            Konsultasi Gratis Dokter Zalta
          </h2>

          <p className="section-description">
            Ajukan pertanyaan awal atau konsultasi seputar
            kendala hewan Anda secara instan.
          </p>

        </div>

        {/* FORM */}

        <div className="consultation-card">

          <form
            className="consultation-form"
            onSubmit={handleConsultSubmit}
          >

            {/* BARIS INPUT */}

            <div className="consult-grid-2">

              {/* NAMA */}

              <div className="form-group">

                <label htmlFor="consult-name">
                  Nama Pemilik
                </label>

                <input
                  id="consult-name"
                  type="text"
                  name="name"
                  placeholder="Contoh: Budi Santoso"
                  value={consultForm.name}
                  onChange={handleConsultChange}
                  required
                />

              </div>

              {/* KATEGORI HEWAN */}

              <div className="form-group">

                <label htmlFor="consult-pet-type">
                  Kategori Hewan
                </label>

                <select
                  id="consult-pet-type"
                  name="petType"
                  value={consultForm.petType}
                  onChange={handleConsultChange}
                >

                  <option value="Kucing">
                    Kucing
                  </option>

                  <option value="Anjing">
                    Anjing
                  </option>

                  <option value="Burung / Unggas">
                    Burung / Unggas
                  </option>

                  <option value="Reptil / Ampibi">
                    Reptil / Ampibi
                  </option>

                  <option value="Ikan / Aquascape">
                    Ikan / Aquascape
                  </option>

                  <option value="Mamalia Kecil">
                    Mamalia Kecil
                  </option>

                </select>

              </div>

            </div>

            {/* PERTANYAAN */}

            <div className="form-group">

              <label htmlFor="consult-message">
                Pertanyaan / Keluhan Kesehatan Hewan
              </label>

              <textarea
                id="consult-message"
                name="message"
                rows="4"
                placeholder="Tuliskan keluhan, perilaku aneh, atau pertanyaan perawatan hewan Anda..."
                value={consultForm.message}
                onChange={handleConsultChange}
                required
              />

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="btn-submit-consult"
            >
              <FaPaperPlane />

              <span>
                Kirim Konsultasi via WhatsApp
              </span>
            </button>

          </form>
        </div>
      </section>

      {/* ==================================================
          KONTAK
          ================================================== */}

      <section
        id="kontak"
        className="landing-section contact-section"
      >

        <div className="section-header-center">

          <span className="section-badge">
            HUBUNGI KAMI
          </span>

          <h2 className="section-title">
            Pusat Layanan Hub Zalta
          </h2>

          <p className="section-description">
            Kami siap membantu kebutuhan kesehatan,
            perawatan, dan kebutuhan hewan kesayangan Anda.
          </p>

        </div>

        <div className="contact-grid">

          {/* TELEPON */}

          <div className="contact-card">

            <div className="contact-icon-wrapper">
              <FaPhoneAlt />
            </div>

            <h3>
              Telepon / WhatsApp
            </h3>

            <p>
              +62 83847622939
            </p>

          </div>

          {/* EMAIL */}

          <div className="contact-card">

            <div className="contact-icon-wrapper">
              <FaEnvelope />
            </div>

            <h3>
              Email Support
            </h3>

            <p>
              support@petcarezalta.com
            </p>

          </div>

          {/* LOKASI */}

          <div className="contact-card">

            <div className="contact-icon-wrapper">
              <FaMapMarkerAlt />
            </div>

            <h3>
              Lokasi Utama Hub
            </h3>

            <p>
              Jl. Utama Zalta Petcare No. 88, Jakarta
            </p>

          </div>

        </div>
      </section>

      {/* ==================================================
          FOOTER
          ================================================== */}

      <Footer />

    </div>
  );
}

export default Home;