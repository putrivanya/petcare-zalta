import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  FaPaw, FaUser, FaPhone, FaHome, FaEnvelope, FaCalendarAlt, FaHeart,
  FaArrowLeft, FaBell, FaCheckCircle, FaTimes, FaMapMarkerAlt,
} from "react-icons/fa";

import api from "../../services/api";
import "./AdoptionForm.css";

const AdoptionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ======= AMBIL USER ID DARI LOCALSTORAGE =======
  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(localStorage.getItem("currentUser"));
      return user?.id || user?.Id_user || user?.userId || null;
    } catch {
      return null;
    }
  };
  const userId = getUserId();

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ======= STATE DENGAN KEY PER HEWAN + USER =======
  const [submitted, setSubmitted] = useState(() => {
    if (!userId) return false;
    return localStorage.getItem(`adoption_submitted_${id}_${userId}`) === "true";
  });
  const [requestId, setRequestId] = useState(() => {
    if (!userId) return null;
    return localStorage.getItem(`adoption_requestId_${id}_${userId}`) || null;
  });
  const [isConfirmed, setIsConfirmed] = useState(() => {
    if (!userId) return false;
    return localStorage.getItem(`adoption_confirmed_${id}_${userId}`) === "true";
  });

  const pollingRef = useRef(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    message: "",
  });

  // ============================================================
  // ✅ AUTO-FILL NAMA, EMAIL, TELEPON, ALAMAT DARI LOCALSTORAGE
  // ============================================================
  useEffect(() => {
    try {
      const rawUser =
        localStorage.getItem("user") ||
        localStorage.getItem("currentUser");

      if (rawUser) {
        const user = JSON.parse(rawUser);

        console.log("=================================");
        console.log("AUTO-FILL ADOPTION FORM:");
        console.log("Nama     :", user.nama || user.name);
        console.log("Email    :", user.email);
        console.log("Telepon  :", user.no_telpon || user.phone);
        console.log("Alamat   :", user.alamat);
        console.log("=================================");

        setFormData((prev) => ({
          ...prev,
          name: user.nama || user.name || prev.name,
          email: user.email || prev.email,
          phone: user.no_telpon || user.phone || prev.phone,
          address: user.alamat || prev.address,
        }));
      }
    } catch (err) {
      console.error("Gagal parse user:", err);
    }
  }, []);

  // ======= AMBIL DATA HEWAN =======
  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/adoptions/${id}`);
        const data = response.data?.data || response.data;
        setAnimal(data);
      } catch (err) {
        setError(err.response?.data?.message || "Data hewan tidak ditemukan.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAnimal();
    else {
      setLoading(false);
      setError("ID hewan tidak ditemukan.");
    }
  }, [id]);

  // ======= NOTIFIKASI OTOMATIS HILANG =======
  useEffect(() => {
    if (!showNotification) return;
    const timer = setTimeout(() => setShowNotification(false), 8000);
    return () => clearTimeout(timer);
  }, [showNotification]);

  // ======= FUNGSI CEK STATUS =======
  const checkRequestStatus = async (reqId) => {
    try {
      if (!reqId || !userId) return;
      const response = await api.get(`/adoption-requests/${reqId}`);
      const data = response.data?.data || response.data;
      if (!data) return;

      const requestUserId = data.user_id || data.userId || data.id_user;
      if (requestUserId && String(requestUserId) !== String(userId)) {
        return;
      }

      const status = String(data.status || "").toLowerCase();
      if (status === "approved") {
        setIsConfirmed(true);
        localStorage.setItem(`adoption_confirmed_${id}_${userId}`, "true");
        setNotificationMessage("Pengajuan adopsi Anda telah disetujui. Silakan jemput hewan Anda di PetCare Hub Zalta.");
        setNotificationType("success");
        setShowNotification(true);
        if (pollingRef.current) clearInterval(pollingRef.current);
        localStorage.removeItem(`adoption_submitted_${id}_${userId}`);
        localStorage.removeItem(`adoption_requestId_${id}_${userId}`);
      } else if (status === "rejected") {
        setNotificationMessage("Maaf, pengajuan adopsi Anda ditolak oleh admin.");
        setNotificationType("error");
        setShowNotification(true);
        if (pollingRef.current) clearInterval(pollingRef.current);
        localStorage.removeItem(`adoption_submitted_${id}_${userId}`);
        localStorage.removeItem(`adoption_requestId_${id}_${userId}`);
        localStorage.removeItem(`adoption_confirmed_${id}_${userId}`);
      }
    } catch (err) {
      console.error("GAGAL CEK STATUS ADOPSI:", err);
    }
  };

  // ======= MULAI POLLING JIKA ADA requestId =======
  useEffect(() => {
    if (!submitted || !requestId || isConfirmed || !userId) return;

    checkRequestStatus(requestId);
    pollingRef.current = setInterval(() => checkRequestStatus(requestId), 5000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [submitted, requestId, isConfirmed, userId, id]);

  // ======= HANDLE CHANGE =======
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ======= SUBMIT FORM =======
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (!/^\d+$/.test(formData.phone)) {
      setError("Nomor telepon hanya boleh berisi angka.");
      setSubmitting(false);
      return;
    }

    if (!userId) {
      setError("Anda harus login terlebih dahulu untuk mengajukan adopsi.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        animal_id: id,
        user_id: userId,
        nama_lengkap: formData.name,
        nomor_telepon: formData.phone,
        email: formData.email,
        alamat: formData.address,
        alasan_adopsi: formData.message || "Saya ingin mengadopsi hewan ini.",
      };

      const response = await api.post("/adoption-requests", payload);
      const adoption = response.data?.data;

      if (!adoption) throw new Error("Data pengajuan tidak dikembalikan server.");

      const backendRequestId = adoption.id || adoption.Id_adoption || adoption.id_adoption || adoption._id;
      if (!backendRequestId) throw new Error("ID pengajuan tidak ditemukan dari database.");

      localStorage.setItem(`adoption_submitted_${id}_${userId}`, "true");
      localStorage.setItem(`adoption_requestId_${id}_${userId}`, backendRequestId);
      localStorage.removeItem(`adoption_confirmed_${id}_${userId}`);

      setRequestId(backendRequestId);
      setSubmitted(true);
      setSuccess(true);
      setNotificationMessage("Pengajuan adopsi berhasil dikirim. Silakan menunggu konfirmasi admin.");
      setNotificationType("success");
      setShowNotification(true);

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Gagal mengirim pengajuan adopsi.");
      setSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  // ======= RENDER =======
  if (loading) return <div className="form-loading"><FaPaw className="spinning" /><p>Memuat data hewan...</p></div>;
  if (error && !animal) return <div className="form-error"><FaPaw /><h3>{error}</h3><button type="button" onClick={() => navigate("/adoption")}>Kembali ke Daftar</button></div>;

  return (
    <div className="adoption-form-page">
      {/* ✅ TOMBOL KEMBALI — DI TEPI KIRI HALAMAN */}
      <button
        type="button"
        className="back-btn-floating"
        onClick={() => navigate("/adoption")}
      >
        <FaArrowLeft /> Kembali
      </button>

      {showNotification && (
        <div className={`notification-banner ${notificationType}`}>
          <FaBell className="notification-icon" />
          <span>{notificationMessage}</span>
          <button className="close-notif" type="button" onClick={() => setShowNotification(false)}>
            <FaTimes />
          </button>
        </div>
      )}

      <div className="form-container">
        <div className="form-header">
          <span className="form-badge"><FaHeart /> AJUKAN ADOPSI</span>
          <h1>Lengkapi Data Diri</h1>
          <p>Isi formulir berikut untuk mengajukan adopsi hewan pilihanmu.</p>
        </div>

        {animal && (
          <div className="animal-preview">
            <img
              src={animal.image ? `http://localhost:5000${animal.image}` : "/placeholder.png"}
              alt={animal.name || "Hewan"}
              onError={(e) => (e.currentTarget.src = "/placeholder.png")}
            />
            <div>
              <h3>{animal.name}</h3>
              <p>
                {animal.animal}
                {animal.breed && ` • ${animal.breed}`}
                {animal.age && ` • ${animal.age}`}
              </p>
            </div>
          </div>
        )}

        <form className="adoption-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FaUser /> Nama Lengkap <span>*</span></label>
            <input
              type="text"
              name="name"
              placeholder="Masukkan nama lengkap Anda"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={submitted && !isConfirmed}
            />
          </div>

          <div className="form-group">
            <label><FaPhone /> Nomor Telepon <span>*</span></label>
            <input
              type="tel"
              name="phone"
              placeholder="Masukkan nomor telepon aktif"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={submitted && !isConfirmed}
              inputMode="numeric"
              pattern="[0-9]*"
              title="Hanya angka yang diperbolehkan"
            />
          </div>

          <div className="form-group">
            <label><FaEnvelope /> Email</label>
            <input
              type="email"
              name="email"
              placeholder="Masukkan alamat email"
              value={formData.email}
              onChange={handleChange}
              disabled={submitted && !isConfirmed}
            />
          </div>

          <div className="form-group">
            <label><FaMapMarkerAlt /> Alamat Lengkap <span>*</span></label>
            <textarea
              name="address"
              rows="3"
              placeholder="Masukkan alamat lengkap Anda"
              value={formData.address}
              onChange={handleChange}
              required
              disabled={submitted && !isConfirmed}
            />
          </div>

          <div className="form-group">
            <label><FaCalendarAlt /> Alasan / Pesan Adopsi <span>*</span></label>
            <textarea
              name="message"
              rows="4"
              placeholder="Jelaskan alasan Anda ingin mengadopsi hewan ini"
              value={formData.message}
              onChange={handleChange}
              required
              disabled={submitted && !isConfirmed}
            />
          </div>

          {error && <div className="form-error-message">{error}</div>}

          {success && !isConfirmed && (
            <div className="form-success-message">
              <FaHeart /> Pengajuan berhasil dikirim!
              <br />
              <small>Menunggu konfirmasi admin. Halaman akan mengecek status secara otomatis.</small>
            </div>
          )}

          {isConfirmed && (
            <div className="form-success-message" style={{ background: "#d4edda", color: "#155724" }}>
              <FaCheckCircle /> Pengajuan Anda telah disetujui!
              <br />
              <small>Silakan jemput hewan adopsi Anda di PetCare Hub Zalta.</small>
              <br />
              <button
                type="button"
                className="submit-btn"
                style={{ marginTop: "12px", background: "#28a745" }}
                onClick={() => navigate("/adoption")}
              >
                Kembali ke Daftar
              </button>
            </div>
          )}

          {!submitted && !isConfirmed && (
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Mengirim..." : <><FaHeart /> Ajukan Adopsi</>}
            </button>
          )}

          {submitted && !isConfirmed && (
            <div style={{ textAlign: "center", color: "#6c7a89", marginTop: "12px" }}>
              <FaPaw style={{ animation: "spin 2s linear infinite" }} /> Menunggu konfirmasi admin...
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdoptionForm;