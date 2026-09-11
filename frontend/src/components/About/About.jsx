import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const featuresData = [
  {
    id: 1,
    title: 'Dokter Berpengalaman',
    desc: 'Tim medis profesional siap memberikan perawatan terbaik.',
    icon: '👨‍⚕️',
  },
  {
    id: 2,
    title: 'Produk Berkualitas',
    desc: 'Menyediakan kebutuhan hewan terlengkap & terjamin.',
    icon: '🛒',
  },
  {
    id: 3,
    title: 'Booking Mudah',
    desc: 'Jadwalkan layanan grooming & dokter secara cepat.',
    icon: '📅',
  },
  {
    id: 4,
    title: 'Pelayanan Terbaik',
    desc: 'Kenyamanan dan keselamatan hewan adalah prioritas utama.',
    icon: '❤️',
  },
];

function About() {
  const navigate = useNavigate();

  // Menggunakan URL gambar dari internet
  const aboutImageUrl = "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1000&auto=format&fit=crop";

  return (
    <section className="about-wrapper">
      {/* SECTION 1: TENTANG PETCARE */}
      <div className="about-container">
        <div className="about-image-box">
          <img src={aboutImageUrl} alt="Tentang PetCare Hub" className="about-img" />
        </div>

        <div className="about-content">
          <h2>Tentang PetCare</h2>
          <p className="about-desc-1">
            PetCare adalah platform yang membantu pemilik hewan mendapatkan semua kebutuhan hewan dalam satu tempat.
          </p>
          <p className="about-desc-2">
            Mulai dari membeli makanan, booking grooming, konsultasi dokter, adopsi, hingga pet hotel.
          </p>
          <button 
            type="button" 
            className="btn-learn-more"
            onClick={() => navigate('/shop')}
          >
            Pelajari Selengkapnya
          </button>
        </div>
      </div>

      {/* SECTION 2: KENAPA MEMILIH PETCARE */}
      <div className="why-us-container">
        <div className="why-us-header">
          <h2>Kenapa Memilih PetCare?</h2>
          <p>Kami memberikan pelayanan terbaik untuk hewan kesayangan Anda.</p>
        </div>

        <div className="features-grid">
          {featuresData.map((item) => (
            <div className="feature-card" key={item.id}>
              <div className="feature-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;