import React, { useEffect, useState } from "react";

import {
  FaPaw,
  FaSearch,
  FaHeart,
  FaVenusMars,
  FaCalendarAlt,
  FaBell,
  FaDog,
  FaCat,
  FaDove,
  FaArrowLeft,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Adoption.css";

const SERVER_URL = "http://localhost:5000";

const Adoption = () => {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // STATE NOTIFIKASI ADOPSI
  const [notification, setNotification] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  // ========================================
  // AMBIL DATA HEWAN
  // ========================================

  const getAdoptions = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/adoptions");
      console.log("DATA ADOPTION:", response.data);
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      setAnimals(data);
    } catch (error) {
      console.error("GET ADOPTIONS ERROR:", error);
      setError("Data adopsi gagal dimuat.");
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // CEK STATUS PENGAJUAN ADOPSI USER
  // ========================================

  const checkAdoptionStatus = async () => {
    try {
      const response = await api.get("/adoption-requests/user");
      const requests = response.data?.data || [];
      processRequests(requests);
    } catch (err) {
      console.warn("Gagal cek status via API, baca dari localStorage:", err.message);
      const localRequests = JSON.parse(localStorage.getItem("adoptionRequests") || "[]");
      processRequests(localRequests);
    }
  };

  const processRequests = (requests) => {
    if (!Array.isArray(requests)) return;
    const notifiedIds = JSON.parse(localStorage.getItem("notifiedAdoptionIds") || "[]");
    const newApproved = requests.filter((req) => {
      const status = req.status?.toLowerCase();
      return (status === "approved" || status === "dikonfirmasi" || status === "selesai") &&
        !notifiedIds.includes(req.id) &&
        !notifiedIds.includes(req._id);
    });

    if (newApproved.length > 0) {
      const first = newApproved[0];
      const animalName = first.animalName || first.animal?.name || "hewan";
      setNotification({
        id: first.id || first._id,
        message: `Terima kasih telah adopsi hewan di PetCare Hub Zalta, silakan jemput hewan anda ke PetCare Hub Zalta.`,
        type: "success",
      });
      setShowNotification(true);
      const updatedIds = [...notifiedIds, first.id || first._id];
      localStorage.setItem("notifiedAdoptionIds", JSON.stringify(updatedIds));
    }
  };

  // ========================================
  // LOAD DATA & POLLING
  // ========================================

  useEffect(() => {
    getAdoptions();
    checkAdoptionStatus();
    const interval = setInterval(checkAdoptionStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // ========================================
  // AUTO-HIDE NOTIFIKASI
  // ========================================

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  // ========================================
  // IMAGE
  // ========================================

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

  // ========================================
  // FILTER SEARCH
  // ========================================

  const filtered = animals.filter((animal) => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return true;
    return (
      animal.name?.toLowerCase().includes(keyword) ||
      animal.animal?.toLowerCase().includes(keyword) ||
      animal.breed?.toLowerCase().includes(keyword)
    );
  });

  // ========================================
  // CEK STATUS
  // ========================================

  const isAvailable = (status) => {
    if (!status) return true;
    const value = status.toLowerCase();
    return value.includes("tersedia") && !value.includes("tidak");
  };

  // ========================================
  // AJUKAN ADOPSI
  // ========================================

  const handleAdoption = (animal) => {
    console.log("HEWAN YANG DIPILIH:", animal);
    if (!animal?.id) {
      console.error("ID hewan tidak ditemukan:", animal);
      alert("ID hewan tidak ditemukan.");
      return;
    }
    navigate(`/adoption/${animal.id}`);
  };

  // ========================================
  // Pilih ikon hewan
  // ========================================

  const getAnimalIcon = (type) => {
    const lower = type?.toLowerCase() || "";
    if (lower.includes("anjing")) return <FaDog />;
    if (lower.includes("kucing")) return <FaCat />;
    if (lower.includes("burung")) return <FaDove />;
    return <FaPaw />;
  };

  // ========================================
  // KEMBALI
  // ========================================

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="adoption-page">

      {/* NOTIFIKASI BANNER */}
      {notification && (
        <div
          className={`notification-banner ${showNotification ? "show" : ""} ${notification.type}`}
        >
          <FaBell className="notification-icon" />
          <span>{notification.message}</span>
          <button
            type="button"
            className="close-notif"
            onClick={() => setShowNotification(false)}
          >
            ✕
          </button>
        </div>
      )}

      {/* HERO */}
      <section className="adoption-hero">
        <div className="hero-content">

          {/* TOMBOL KEMBALI – menggunakan class */}
          <div className="back-button-container">
            <button type="button" className="back-button" onClick={goBack}>
              <FaArrowLeft /> Kembali
            </button>
          </div>

          {/* Ikon hewan */}
          <div className="hero-animal-icons">
            <span><FaDog /></span>
            <span><FaCat /></span>
            <span><FaDove /></span>
            <span><FaPaw /></span>
          </div>

          <span className="hero-label">
            <FaHeart /> ADOPSI HEWAN
          </span>

          <h1>
            Temukan Sahabat
            <br />
            <strong>Baru Untukmu</strong>
          </h1>

          <p>
            Temukan hewan yang membutuhkan keluarga baru dan berikan mereka
            rumah penuh kasih sayang.
          </p>

        </div>
      </section>

      {/* CONTENT */}
      <section className="adoption-content">

        {/* HEADING */}
        <div className="adoption-heading">
          <div>
            <small>HEWAN ADOPSI</small>
            <h2>Cari Hewan Impianmu</h2>
            <p>Pilih sahabat baru yang cocok untuk keluargamu.</p>
          </div>

          {/* SEARCH – ukuran lebih kecil */}
          <div className="adoption-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Cari nama, jenis, atau ras..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="adoption-state">
            <div className="loading-paw">
              <FaPaw />
            </div>
            <h3>Memuat data adopsi...</h3>
            <p>Sedang mengambil data hewan.</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="adoption-state error-state">
            <FaPaw />
            <h3>Terjadi Kesalahan</h3>
            <p>{error}</p>
            <button type="button" onClick={getAdoptions}>Coba Lagi</button>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && filtered.length === 0 && (
          <div className="adoption-state">
            <FaPaw />
            <h3>Belum Ada Hewan</h3>
            <p>
              {search
                ? "Hewan yang kamu cari tidak ditemukan."
                : "Admin belum menambahkan hewan untuk adopsi."}
            </p>
          </div>
        )}

        {/* GRID */}
        {!loading && !error && filtered.length > 0 && (
          <div className="adoption-grid">
            {filtered.map((animal) => (
              <article className="adoption-card" key={animal.id}>
                {/* IMAGE */}
                <div className="adoption-image">
                  {animal.image ? (
                    <img
                      src={getImage(animal.image)}
                      alt={animal.name || "Hewan adopsi"}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="image-placeholder">
                      {getAnimalIcon(animal.animal)}
                    </div>
                  )}
                  <span className={isAvailable(animal.status) ? "available" : "not-available"}>
                    {animal.status || "Tersedia"}
                  </span>
                </div>

                {/* BODY */}
                <div className="adoption-body">
                  <span className="adoption-type">
                    {getAnimalIcon(animal.animal)}
                    {animal.animal || "Hewan"}
                  </span>
                  <h3>{animal.name || "Nama Hewan"}</h3>
                  <div className="adoption-meta">
                    {animal.breed && <span>Ras: {animal.breed}</span>}
                    {animal.age && (
                      <span>
                        <FaCalendarAlt /> Umur: {animal.age}
                      </span>
                    )}
                    {animal.gender && (
                      <span>
                        <FaVenusMars /> {animal.gender}
                      </span>
                    )}
                  </div>
                  <p className="adoption-description">
                    {animal.description ||
                      "Hewan ini sedang mencari keluarga baru yang penuh kasih sayang."}
                  </p>
                  <button
                    type="button"
                    className="adoption-button"
                    disabled={!isAvailable(animal.status)}
                    onClick={() => handleAdoption(animal)}
                  >
                    <FaHeart />
                    {isAvailable(animal.status) ? "Ajukan Adopsi" : "Tidak Tersedia"}
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

export default Adoption;