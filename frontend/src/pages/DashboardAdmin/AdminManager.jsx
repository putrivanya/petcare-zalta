import React, { useState, useEffect } from "react";
import api from "../../services/api";

function AdminManager({ activeMenu = "Produk" }) { // Diberi default "Produk" agar tidak kosong
  const [dataList, setDataList] = useState([]);
  const [form, setForm] = useState({});

  const getEndpoint = () => {
    switch (activeMenu) {
      case "Produk": return "/products";
      case "Dokter": return "/doctors";
      case "Grooming": return "/grooming";
      case "Hotel": return "/hotels";
      case "Adopsi": return "/adoptions";
      default: return "/products";
    }
  };

  const fetchContent = async () => {
    try {
      const res = await api.get(getEndpoint());
      setDataList(res.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    }
  };

  useEffect(() => {
    fetchContent();
    setForm({});
  }, [activeMenu]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(getEndpoint(), form);
      alert(`Data ${activeMenu} berhasil ditambahkan!`);
      setForm({});
      fetchContent();
    } catch (err) {
      alert("Gagal menambahkan data");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus item ini?")) {
      try {
        await api.delete(`${getEndpoint()}/${id}`);
        fetchContent();
      } catch (err) {
        alert("Gagal menghapus data");
      }
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "left", width: "100%", boxSizing: "border-box" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", color: "#333" }}>
        Kelola {activeMenu}
      </h2>

      {/* FORM INPUT */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "500px", marginBottom: "30px", background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        {activeMenu === "Produk" && (
          <>
            <input placeholder="Nama Produk" value={form.name || ""} onChange={(e) => setForm({...form, name: e.target.value})} required style={inputStyle} />
            <input placeholder="Kategori" value={form.category || ""} onChange={(e) => setForm({...form, category: e.target.value})} required style={inputStyle} />
            <input type="number" placeholder="Harga" value={form.price || ""} onChange={(e) => setForm({...form, price: e.target.value})} required style={inputStyle} />
            <input placeholder="URL Gambar" value={form.image || ""} onChange={(e) => setForm({...form, image: e.target.value})} style={inputStyle} />
          </>
        )}

        {activeMenu === "Dokter" && (
          <>
            <input placeholder="Nama Dokter" value={form.name || ""} onChange={(e) => setForm({...form, name: e.target.value})} required style={inputStyle} />
            <input placeholder="Spesialisasi" value={form.specialization || ""} onChange={(e) => setForm({...form, specialization: e.target.value})} required style={inputStyle} />
            <input placeholder="Pengalaman (misal: 5 Tahun)" value={form.experience || ""} onChange={(e) => setForm({...form, experience: e.target.value})} style={inputStyle} />
            <input type="number" placeholder="Biaya Konsultasi" value={form.price || ""} onChange={(e) => setForm({...form, price: e.target.value})} required style={inputStyle} />
            <input placeholder="URL Foto Dokter" value={form.image || ""} onChange={(e) => setForm({...form, image: e.target.value})} style={inputStyle} />
          </>
        )}

        {activeMenu === "Grooming" && (
          <>
            <input placeholder="Nama Layanan" value={form.serviceName || ""} onChange={(e) => setForm({...form, serviceName: e.target.value})} required style={inputStyle} />
            <input placeholder="Deskripsi" value={form.description || ""} onChange={(e) => setForm({...form, description: e.target.value})} style={inputStyle} />
            <input type="number" placeholder="Harga" value={form.price || ""} onChange={(e) => setForm({...form, price: e.target.value})} required style={inputStyle} />
            <input placeholder="Durasi (misal: 60 menit)" value={form.duration || ""} onChange={(e) => setForm({...form, duration: e.target.value})} style={inputStyle} />
          </>
        )}

        {activeMenu === "Hotel" && (
          <>
            <input placeholder="Tipe Kamar" value={form.roomType || ""} onChange={(e) => setForm({...form, roomType: e.target.value})} required style={inputStyle} />
            <input placeholder="Kapasitas" value={form.capacity || ""} onChange={(e) => setForm({...form, capacity: e.target.value})} style={inputStyle} />
            <input type="number" placeholder="Harga per Malam" value={form.pricePerNight || ""} onChange={(e) => setForm({...form, pricePerNight: e.target.value})} required style={inputStyle} />
            <input placeholder="Fasilitas" value={form.facilities || ""} onChange={(e) => setForm({...form, facilities: e.target.value})} style={inputStyle} />
          </>
        )}

        {activeMenu === "Adopsi" && (
          <>
            <input placeholder="Nama Hewan" value={form.petName || ""} onChange={(e) => setForm({...form, petName: e.target.value})} required style={inputStyle} />
            <input placeholder="Jenis (Kucing/Anjing)" value={form.type || ""} onChange={(e) => setForm({...form, type: e.target.value})} required style={inputStyle} />
            <input placeholder="Ras" value={form.breed || ""} onChange={(e) => setForm({...form, breed: e.target.value})} style={inputStyle} />
            <input placeholder="Umur" value={form.age || ""} onChange={(e) => setForm({...form, age: e.target.value})} style={inputStyle} />
            <input placeholder="URL Gambar" value={form.image || ""} onChange={(e) => setForm({...form, image: e.target.value})} style={inputStyle} />
          </>
        )}

        <button type="submit" style={{ padding: "10px 15px", background: "#0d9488", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
          + Tambah {activeMenu}
        </button>
      </form>

      {/* TABEL DATA */}
      <div style={{ overflowX: "auto", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f3f4f6", borderBottom: "2px solid #e5e7eb" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Nama / Item</th>
              <th style={thStyle}>Detail / Harga</th>
              <th style={thStyle}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataList.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: "15px", textAlign: "center", color: "#888" }}>Belum ada data {activeMenu}</td>
              </tr>
            ) : (
              dataList.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={tdStyle}>{item.id}</td>
                  <td style={tdStyle}>{item.name || item.serviceName || item.roomType || item.petName}</td>
                  <td style={tdStyle}>Rp {Number(item.price || item.pricePerNight || 0).toLocaleString("id-ID")}</td>
                  <td style={tdStyle}>
                    <button onClick={() => handleDelete(item.id)} style={{ color: "#ef4444", background: "none", border: "1px solid #ef4444", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  outline: "none"
};

const thStyle = {
  padding: "12px 15px",
  fontWeight: "bold",
  color: "#374151"
};

const tdStyle = {
  padding: "12px 15px",
  color: "#4b5563"
};

export default AdminManager;