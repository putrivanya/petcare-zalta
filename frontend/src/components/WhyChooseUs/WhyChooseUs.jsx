import React from 'react';
import './WhyChooseUs.css';

function WhyChooseUs() {
  const whyData = [
    {
      id: 1,
      icon: "🚑",
      title: "Layanan Darurat 24/7",
      desc: "Tim medis dan ambulans hewan kami siap siaga menangani kondisi darurat kapan saja."
    },
    {
      id: 2,
      icon: "📹",
      title: "Pantau Pet Hotel via CCTV",
      desc: "Pemilik bisa memantau kondisi dan aktivitas anabul secara live melalui aplikasi."
    },
    {
      id: 3,
      icon: "🧼",
      title: "Fasilitas Steril & Higienis",
      desc: "Peralatan grooming dan ruang perawatan selalu didisinfeksi demi kesehatan hewan."
    },
    {
      id: 4,
      icon: "💬",
      title: "Konsultasi Cepat via WA",
      desc: "Kemudahan tanya jawab dan reservasi langsung dengan customer service kami."
    }
  ];

  return (
    <section id="keunggulan" className="why">
      <div className="why-header">
        <h2>Keunggulan PetCare Hub</h2>
        <p>
          Komitmen kami untuk memberikan standar perawatan dan kenyamanan tertinggi bagi hewan kesayangan Anda.
        </p>
      </div>

      <div className="why-container">
        {whyData.map((item) => (
          <div className="why-card" key={item.id}>
            <div className="icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;