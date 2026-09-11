import React from 'react';
import './Services.css';

const servicesData = [
  {
    id: 1,
    title: 'Pet Grooming',
    desc: 'Layanan mandi, potong bulu, nail trimming, dan spa agar hewan tetap bersih dan sehat.',
    icon: '✂️',
  },
  {
    id: 2,
    title: 'Dokter Hewan',
    desc: 'Konsultasi kesehatan, pemeriksaan, pengobatan, serta vaksinasi oleh dokter hewan profesional.',
    icon: '🩺',
  },
  {
    id: 3,
    title: 'Klinik Hewan',
    desc: 'Pelayanan kesehatan lengkap mulai dari pemeriksaan rutin hingga tindakan medis.',
    icon: '🏥',
  },
  {
    id: 4,
    title: 'Pet Hotel',
    desc: 'Penitipan hewan dengan ruangan nyaman, aman, dan diawasi setiap hari.',
    icon: '🏨',
  },
  {
    id: 5,
    title: 'Pet Shop',
    desc: 'Berbagai makanan, vitamin, mainan, kandang, pakaian, dan aksesori.',
    icon: '🍖',
  },
  {
    id: 6,
    title: 'Delivery Pet Food',
    desc: 'Pesan makanan dan perlengkapan hewan dari rumah dengan pengiriman cepat.',
    icon: '🚚',
  },
  {
    id: 7,
    title: 'Adopsi Hewan',
    desc: 'Temukan sahabat baru melalui layanan adopsi hewan yang aman dan terpercaya.',
    icon: '🐶',
  },
  {
    id: 8,
    title: 'Pet Training',
    desc: 'Pelatihan dasar untuk anjing dan kucing agar lebih patuh dan mudah diarahkan.',
    icon: '🎓',
  },
];

function Services() {
  return (
    <section id="layanan" className="services-section">
      <div className="services-header">
        <h2>Layanan PetCare</h2>
        <p>
          Semua kebutuhan hewan peliharaan Anda tersedia dalam satu platform.
          Mulai dari kesehatan, perawatan, belanja kebutuhan hewan, hingga adopsi.
        </p>
      </div>

      <div className="services-grid">
        {servicesData.map((item) => (
          <div className="service-card" key={item.id}>
            <div className="icon-wrapper">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;