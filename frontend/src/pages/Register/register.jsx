import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import "./register.css";

import {
  FaCheck,
  FaBan,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPaw,
  FaShoppingBag,
  FaHome,
  FaCut,
  FaComments,
  FaHeart,
  FaFeather,
  FaStar
} from "react-icons/fa";

// =====================================================
// 1. KOMPONEN TOAST
// =====================================================
const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type || "info"}`}>
          <div className="toast-icon">
            {toast.type === "success" && <FaCheck />}
            {toast.type === "error" && <FaBan />}
            {toast.type === "info" && <FaInfoCircle />}
            {toast.type === "warning" && <FaExclamationTriangle />}
          </div>
          <div className="toast-content">
            <div className="toast-message">{toast.message}</div>
          </div>
          <button
            type="button"
            className="toast-close"
            onClick={() => onRemove(toast.id)}
          >
            <FaTimes />
          </button>
          <div
            className="toast-progress"
            style={{ animationDuration: `${toast.duration}ms` }}
          />
        </div>
      ))}
    </div>
  );
};

// =====================================================
// 2. KOMPONEN UTAMA REGISTER
// =====================================================
function Register() {
  const navigate = useNavigate();

  const [toasts, setToasts] = useState([]);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alamat, setAlamat] = useState("");
  const [noTelpon, setNoTelpon] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================
  // FUNGSI TOAST
  // ============================
  const showToast = (message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ============================
  // VALIDASI TELEPON
  // ============================
  const isValidPhone = (phone) => {
    const cleaned = phone.replace(/[\s\-()]/g, "");
    return /^\+?[0-9]{9,15}$/.test(cleaned);
  };

  // ============================
  // HANDLE SUBMIT
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidPhone(noTelpon)) {
      showToast(
        "Nomor telepon tidak valid. Gunakan 9-15 digit angka.",
        "warning"
      );
      return;
    }

    if (alamat.trim().length < 10) {
      showToast("Alamat terlalu pendek. Mohon isi alamat lengkap.", "warning");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        nama: nama.trim(),
        email: email.trim().toLowerCase(),
        password,
        alamat: alamat.trim(),
        no_telpon: noTelpon.trim(),
        role: "pelanggan"
      });

      showToast(
        response.data?.message || "Registrasi berhasil! Silakan login.",
        "success"
      );

      setNama("");
      setEmail("");
      setPassword("");
      setAlamat("");
      setNoTelpon("");

      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registrasi gagal, silakan coba lagi atau cek koneksi server.";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // RENDER
  // ============================
  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="register-container">
        <div className="register-wrapper">
          {/* ============================================
              BAGIAN KIRI — FORM (PUTIH)
          ============================================ */}
          <div className="register-card">
            {/* Header khusus mobile */}
            <div className="mobile-header">
              <div className="paw-logo">
                <FaPaw />
              </div>
              <div className="mobile-brand-text">
                <h1>PetCare</h1>
                <p>Sahabat Hewan</p>
              </div>
            </div>

            <h2>Buat Akun</h2>
            <p className="subtitle">
              Daftar gratis untuk belanja, adopsi, grooming & konsultasi hewan.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Nama */}
              <div className="input-box">
                <label htmlFor="nama">Nama Lengkap</label>
                <div className="input-wrapper">
                  <span className="input-icon"><FaUser /></span>
                  <input
                    id="nama"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="input-box">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <span className="input-icon"><FaEnvelope /></span>
                  <input
                    id="email"
                    type="email"
                    placeholder="Masukkan email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="input-box">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon"><FaLock /></span>
                  <input
                    id="password"
                    type="password"
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </div>
              </div>

              {/* Nomor Telepon */}
              <div className="input-box">
                <label htmlFor="noTelpon">Nomor Telepon</label>
                <div className="input-wrapper">
                  <span className="input-icon"><FaPhoneAlt /></span>
                  <input
                    id="noTelpon"
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={noTelpon}
                    onChange={(e) => setNoTelpon(e.target.value)}
                    inputMode="tel"
                    required
                  />
                </div>
              </div>

              {/* Alamat */}
              <div className="input-box">
                <label htmlFor="alamat">Alamat Lengkap</label>
                <div className="input-wrapper textarea-wrapper">
                  <span className="input-icon"><FaMapMarkerAlt /></span>
                  <textarea
                    id="alamat"
                    placeholder="Jl. Merdeka No. 10, Kota Bandung, 40123"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    rows={2}
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading}>
                <FaPaw />
                {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
              </button>
            </form>

            <div className="login-text">
              Sudah punya akun? <Link to="/login">Login</Link>
            </div>
          </div>

          {/* ============================================
              BAGIAN KANAN — HERO INFO (BIRU)
          ============================================ */}
          <div className="register-info">
            {/* Floating icons */}
            <div className="floating-icons" aria-hidden="true">
              <FaFeather className="float-icon f1" />
              <FaHeart   className="float-icon f2" />
              <FaStar    className="float-icon f3" />
            </div>

            {/* Brand kecil */}
            <div className="hero-brand">
              <div className="paw-logo"><FaPaw /></div>
              <h1>PetCare</h1>
            </div>

            {/* Ilustrasi */}
            <div className="hero-illustration" aria-hidden="true">
              <div className="hero-center">
                <FaPaw />
              </div>
            </div>

            {/* Title */}
            <h2 className="hero-title">
              Semua Kebutuhan Hewan
              <br />
              Dalam Satu Platform 🐾
            </h2>
            <p className="hero-subtitle">
              Belanja, adopsi, grooming, dan konsultasi hewan kesayanganmu
              dengan mudah & terpercaya.
            </p>

            {/* Feature cards */}
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon"><FaShoppingBag /></span>
                Beli Kebutuhan Hewan
              </div>
              <div className="feature-item">
                <span className="feature-icon"><FaHome /></span>
                Adopsi Hewan
              </div>
              <div className="feature-item">
                <span className="feature-icon"><FaCut /></span>
                Grooming
              </div>
              <div className="feature-item">
                <span className="feature-icon"><FaComments /></span>
                Konsultasi
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;