import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPaw,
  FaClock,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaStickyNote,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./BookingGrooming.css";

const API_URL = "http://localhost:5000/api";

const BookingGrooming = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const grooming = location.state?.grooming || {};

  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    phone: "",
    address: "",
    date: "",
    time: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================================
  // AUTO-FILL DARI LOCALSTORAGE
  // ============================================================
  useEffect(() => {
    try {
      const rawUser =
        localStorage.getItem("user") ||
        localStorage.getItem("currentUser");

      if (rawUser) {
        const user = JSON.parse(rawUser);

        console.log("=================================");
        console.log("AUTO-FILL BOOKING GROOMING:");
        console.log("Nama     :", user.nama || user.name);
        console.log("Email    :", user.email);
        console.log("Telepon  :", user.no_telpon || user.phone);
        console.log("Alamat   :", user.alamat);
        console.log("=================================");

        setFormData((prev) => ({
          ...prev,
          userName: user.nama || user.name || "",
          userEmail: user.email || "",
          phone: user.no_telpon || user.phone || "",
          address: user.alamat || "",
        }));
      }
    } catch (err) {
      console.error("Gagal parse user:", err);
    }
  }, []);

  // ============================================================
  // HANDLE CHANGE — FILTER ANGKA untuk phone
  // ============================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: onlyNumbers }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ============================================================
  // CEGAH HURUF / SIMBOL LEWAT KEYBOARD (phone)
  // ============================================================
  const handleKeyPress = (e) => {
    if (e.target.name === "phone") {
      const key = e.key;
      if (
        !/^[0-9]$/.test(key) &&
        key !== "Backspace" &&
        key !== "Delete" &&
        key !== "ArrowLeft" &&
        key !== "ArrowRight" &&
        key !== "ArrowUp" &&
        key !== "ArrowDown" &&
        key !== "Tab" &&
        key !== "Enter"
      ) {
        e.preventDefault();
      }
    }
  };

  // ============================================================
  // SUBMIT
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.userName || !formData.userEmail || !formData.date || !formData.time) {
      setError("Nama, email, tanggal, dan waktu wajib diisi.");
      setLoading(false);
      return;
    }

    if (formData.phone && formData.phone.length < 10) {
      setError("Nomor telepon minimal 10 digit (jika diisi).");
      setLoading(false);
      return;
    }

    if (formData.phone && !/^\d+$/.test(formData.phone)) {
      setError("Nomor telepon hanya boleh berisi angka.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        type: "grooming",
        itemName: grooming.name || "Layanan Grooming",
        price: Number(grooming.price) || 0,
        quantity: 1,
        total: Number(grooming.price) || 0,
        date: formData.date,
        time: formData.time,
        userName: formData.userName,
        userEmail: formData.userEmail,
        phone: formData.phone || "-",
        address: formData.address || "-",
        items: JSON.stringify([
          {
            name: grooming.name,
            price: grooming.price,
            quantity: 1,
          },
        ]),
        paymentMethod: "COD",
        notes: formData.notes || "",
      };

      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal melakukan booking.");
      }

      setSuccess("✅ Booking grooming berhasil! Tunggu konfirmasi admin.");
      setFormData((prev) => ({ ...prev, date: "", time: "", notes: "" }));

      setTimeout(() => {
        navigate("/booking-status");
      }, 2000);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-grooming-page">
      <div className="booking-grooming-container">
        {/* TOMBOL KEMBALI ATAS */}
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft /> Kembali
        </button>

        <div className="booking-header">
          <FaPaw className="booking-icon" />
          <h1>Booking Grooming</h1>
          <p>Isi data berikut untuk memesan layanan grooming.</p>
        </div>

        <div className="grooming-summary">
          <h3>Layanan yang Dipesan</h3>
          <div className="summary-item">
            <span className="summary-label">Nama Layanan</span>
            <span className="summary-value">
              {grooming.name || "Layanan Grooming"}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Harga</span>
            <span className="summary-value">
              Rp {Number(grooming.price || 0).toLocaleString("id-ID")}
            </span>
          </div>
          {grooming.duration && (
            <div className="summary-item">
              <span className="summary-label">Durasi</span>
              <span className="summary-value">{grooming.duration}</span>
            </div>
          )}
          {grooming.animal && (
            <div className="summary-item">
              <span className="summary-label">Kategori Hewan</span>
              <span className="summary-value">{grooming.animal}</span>
            </div>
          )}
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-group">
            <label>
              <FaUser /> Nama Lengkap <span>*</span>
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FaEnvelope /> Email <span>*</span>
            </label>
            <input
              type="email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              placeholder="Masukkan email aktif"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FaPhone /> Nomor Telepon
            </label>
            <input
              type="text"
              inputMode="numeric"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Masukkan nomor telepon (hanya angka)"
              maxLength="15"
              title="Hanya angka, minimal 10 digit"
              autoComplete="tel"
            />
          </div>

          {/* FIELD ALAMAT */}
          <div className="form-group">
            <label>
              <FaMapMarkerAlt /> Alamat (opsional)
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Alamat lengkap"
              autoComplete="street-address"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <FaCalendarAlt /> Tanggal <span>*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="form-group">
              <label>
                <FaClock /> Waktu <span>*</span>
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <FaStickyNote /> Catatan (opsional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Tambahkan catatan khusus untuk grooming (misal: alergi, jenis bulu, dll)"
              rows="3"
            />
          </div>

          {/* ✅ HANYA TOMBOL SUBMIT — TOMBOL KEMBALI BAWAH DIHAPUS */}
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Memproses..." : "Booking Sekarang"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingGrooming;