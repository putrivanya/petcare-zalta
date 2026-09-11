import React, { useEffect, useState } from "react";
import {
  FaCut,
  FaSearch,
  FaClock,
  FaMoneyBillWave,
  FaPaw,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Grooming.css";

const SERVER_URL = "http://localhost:5000";

const Grooming = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // ==========================================
  // AMBIL DATA GROOMING
  // ==========================================
  const getGrooming = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/grooming");
      console.log("DATA GROOMING:", response.data);
      setServices(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error("Gagal mengambil data grooming:", error);
      setError("Data grooming gagal dimuat.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD DATA
  // ==========================================
  useEffect(() => {
    getGrooming();
  }, []);

  // ==========================================
  // GAMBAR
  // ==========================================
  const getImage = (image) => {
    if (!image) return "";
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    if (image.startsWith("/")) {
      return `${SERVER_URL}${image}`;
    }
    return `${SERVER_URL}/${image}`;
  };

  // ==========================================
  // SEARCH
  // ==========================================
  const keyword = search.toLowerCase().trim();
  const filtered = services.filter((item) => {
    return (
      !keyword ||
      item.name?.toLowerCase().includes(keyword) ||
      item.animal?.toLowerCase().includes(keyword) ||
      item.description?.toLowerCase().includes(keyword)
    );
  });

  // ==========================================
  // BOOKING
  // ==========================================
  const handleBooking = (item) => {
    console.log("Booking grooming:", item);
    navigate("/booking-grooming", {
      state: { grooming: item },
    });
  };

  return (
    <div className="grooming-page">
      {/* ===== TOMBOL KEMBALI ===== */}
      <div className="grooming-back-wrapper">
        <button className="grooming-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Kembali
        </button>
      </div>

      {/* HERO */}
      <section className="grooming-hero">
        <div className="grooming-hero-content">
          <span className="grooming-label">
            <FaCut />
            PET GROOMING
          </span>
          <h1>
            Perawatan Terbaik
            <span>untuk Hewanmu</span>
          </h1>
          <p>Pilih layanan grooming yang tersedia dari PetCare Hub Zalta.</p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="grooming-content">
        <div className="grooming-heading">
          <div>
            <small>LAYANAN GROOMING</small>
            <h2>Pilih Perawatan</h2>
          </div>
          <div className="grooming-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Cari layanan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grooming-state">
            <div className="loading-spinner"></div>
            <p>Memuat layanan grooming...</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="grooming-state error">
            <FaCut />
            <h3>Terjadi Kesalahan</h3>
            <p>{error}</p>
            <button type="button" onClick={getGrooming}>
              Coba Lagi
            </button>
          </div>
        )}

        {/* DATA KOSONG */}
        {!loading && !error && filtered.length === 0 && (
          <div className="grooming-state">
            <FaCut />
            <h3>{keyword ? "Layanan Tidak Ditemukan" : "Belum Ada Layanan"}</h3>
            <p>
              {keyword
                ? `Tidak ada layanan yang cocok dengan "${search}".`
                : "Admin belum menambahkan layanan grooming."}
            </p>
          </div>
        )}

        {/* GRID */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grooming-grid">
            {filtered.map((item, index) => (
              <article
                className="grooming-card"
                key={item.id || item.Id_grooming || index}
              >
                {/* IMAGE */}
                <div className="grooming-image">
                  {item.image ? (
                    <img
                      src={getImage(item.image)}
                      alt={item.name || "Grooming"}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <FaCut />
                  )}
                </div>

                {/* BODY */}
                <div className="grooming-body">
                  <span className="grooming-animal">
                    <FaPaw />
                    {item.animal || "Semua Hewan"}
                  </span>
                  <h3>{item.name || "Layanan Grooming"}</h3>
                  <p>
                    {item.description ||
                      "Layanan grooming terbaik untuk hewan kesayangan Anda."}
                  </p>
                  <div className="grooming-details">
                    {item.duration && (
                      <span>
                        <FaClock />
                        {item.duration}
                      </span>
                    )}
                    {item.price !== null &&
                      item.price !== undefined &&
                      item.price !== "" && (
                        <strong>
                          <FaMoneyBillWave />
                          Rp {Number(item.price).toLocaleString("id-ID")}
                        </strong>
                      )}
                  </div>

                  {/* TOMBOL BOOKING */}
                  <button
                    type="button"
                    className="booking-grooming-btn"
                    onClick={() => handleBooking(item)}
                  >
                    Booking Grooming
                    <FaArrowRight />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Grooming;