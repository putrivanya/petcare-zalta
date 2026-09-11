import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import "./login.css";

const Login = () => {
  // =====================================================
  // STATE
  // =====================================================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // =====================================================
  // LOGIN
  // =====================================================
  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorMsg("");

    // ===================================================
    // VALIDASI INPUT
    // ===================================================
    if (!email.trim()) {
      setErrorMsg("Email wajib diisi!");
      return;
    }

    if (!password.trim()) {
      setErrorMsg("Password wajib diisi!");
      return;
    }

    try {
      setLoading(true);

      console.log("=================================");
      console.log("LOGIN FRONTEND");
      console.log("Email:", email.trim());
      console.log("=================================");

      // =================================================
      // REQUEST KE BACKEND
      // =================================================
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password: password,
      });

      const data = response.data;

      console.log("=================================");
      console.log("RESPONSE LOGIN");
      console.log(data);
      console.log("=================================");

      // =================================================
      // CEK RESPONSE
      // =================================================
      if (!data) {
        setErrorMsg("Response dari server kosong.");
        return;
      }

      if (!data.success) {
        setErrorMsg(data.message || "Login gagal.");
        return;
      }

      // =================================================
      // CEK TOKEN
      // =================================================
      if (!data.token) {
        console.error("TOKEN TIDAK DITEMUKAN:", data);
        setErrorMsg("Token login tidak ditemukan.");
        return;
      }

      // =================================================
      // CEK USER
      // =================================================
      if (!data.user) {
        console.error("USER TIDAK DITEMUKAN:", data);
        setErrorMsg("Data pengguna tidak ditemukan.");
        return;
      }

      const user = data.user;

      console.log("=================================");
      console.log("USER DARI BACKEND");
      console.log("ID USER:", user.id);
      console.log("NAMA:", user.nama);
      console.log("EMAIL:", user.email);
      console.log("ID ROLE:", user.id_role);
      console.log("ROLE:", user.role);
      console.log("ALAMAT:", user.alamat);
      console.log("NO TELPON:", user.no_telpon);
      console.log("=================================");

      // =================================================
      // AMBIL ID ROLE
      // DATABASE:
      // 1 = admin
      // 2 = pelanggan
      // =================================================
      const idRole = Number(user.id_role);

      console.log("ID ROLE SETELAH CONVERT:", idRole);

      // =================================================
      // VALIDASI ID ROLE
      // =================================================
      if (idRole !== 1 && idRole !== 2) {
        console.error("ID ROLE TIDAK VALID:", user.id_role);
        setErrorMsg("Role akun tidak valid.");
        return;
      }

      // =================================================
      // TENTUKAN NAMA ROLE
      // =================================================
      let role = "";

      if (idRole === 1) {
        role = "admin";
      }

      if (idRole === 2) {
        role = "pelanggan";
      }

      console.log("ROLE HASIL DATABASE:", role);

      // =================================================
      // BUAT DATA USER YANG KONSISTEN
      // =================================================
      // ✅ PERUBAHAN: tambah alamat & no_telpon
      const userData = {
        id: user.id,
        nama: user.nama,
        email: user.email,
        id_role: idRole,
        role: role,
        alamat: user.alamat || "",
        no_telpon: user.no_telpon || "",
      };

      console.log("=================================");
      console.log("USER DATA FINAL");
      console.log(userData);
      console.log("=================================");

      // =================================================
      // HAPUS LOGIN LAMA
      // =================================================
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("currentUser");

      // =================================================
      // SIMPAN TOKEN
      // =================================================
      localStorage.setItem("token", data.token);

      // =================================================
      // SIMPAN USER
      // =================================================
      localStorage.setItem("user", JSON.stringify(userData));

      // =================================================
      // COMPATIBILITY DENGAN KODE LAMA
      // =================================================
      localStorage.setItem("currentUser", JSON.stringify(userData));

      // =================================================
      // REMEMBER ME
      // =================================================
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email.trim());
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // =================================================
      // LOGIN BERHASIL
      // =================================================
      console.log("=================================");
      console.log("LOGIN BERHASIL");
      console.log("=================================");
      console.log("ID USER:", userData.id);
      console.log("NAMA:", userData.nama);
      console.log("EMAIL:", userData.email);
      console.log("ID ROLE:", userData.id_role);
      console.log("ROLE:", userData.role);
      console.log("ALAMAT:", userData.alamat);
      console.log("NO TELPON:", userData.no_telpon);
      console.log("=================================");

      // =================================================
      // REDIRECT ADMIN
      // =================================================
      if (idRole === 1) {
        console.log("REDIRECT → HALAMAN ADMIN");
        navigate("/admin", { replace: true });
        return;
      }

      // =================================================
      // REDIRECT PELANGGAN
      // =================================================
      if (idRole === 2) {
        console.log("REDIRECT → HALAMAN PELANGGAN");
        navigate("/dashboard", { replace: true });
        return;
      }
    } catch (error) {
      // =================================================
      // ERROR LOGIN
      // =================================================
      console.error("=================================");
      console.error("ERROR LOGIN:", error);
      console.error("=================================");

      // =================================================
      // HAPUS DATA LOGIN
      // =================================================
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("currentUser");

      // =================================================
      // ERROR DARI BACKEND
      // =================================================
      if (error.response) {
        console.log("STATUS:", error.response.status);
        console.log("DATA ERROR:", error.response.data);

        setErrorMsg(
          error.response.data?.message || "Terjadi kesalahan pada server."
        );
      }

      // =================================================
      // SERVER TIDAK BISA DIHUBUNGI
      // =================================================
      else if (error.request) {
        setErrorMsg("Server backend tidak dapat dihubungi.");
      }

      // =================================================
      // ERROR LAIN
      // =================================================
      else {
        setErrorMsg(error.message || "Terjadi kesalahan saat login.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="login-container">
      <div className="login-card">
        {/* =================================================
            BAGIAN KIRI
        ================================================== */}
        <div className="login-left">
          {/* LOGO */}
          <div className="brand-logo">
            <svg
              className="paw-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 11.5c-1.8 0-3.5 1.4-3.5 3.3 0 2.2 2.3 4.2 3.5 5.2 1.2-1 3.5-3 3.5-5.2 0-1.9-1.7-3.3-3.5-3.3zm-5.5-2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm11 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-12.5 5c.8 0 1.5-.7 1.5-1.5S5.8 11.5 5 11.5 3.5 12.2 3.5 13s.7 1.5 1.5 1.5zm14 0c.8 0 1.5-.7 1.5-1.5S19.8 11.5 19 11.5s-1.5.7-1.5 1.5.7 1.5 1.5 1.5z" />
            </svg>

            <span className="brand-name">PETCARE</span>
          </div>

          {/* JUDUL */}
          <h1 className="welcome-title">Selamat Datang!</h1>

          {/* ERROR */}
          {errorMsg && <div className="error-alert">{errorMsg}</div>}

          {/* =================================================
              FORM LOGIN
          ================================================== */}
          <form onSubmit={handleLogin} className="login-form">
            {/* EMAIL */}
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@gmail.com"
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <label htmlFor="password">Password</label>

              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan Password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />

                {/* TOMBOL LIHAT PASSWORD */}
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Lihat password"
                  }
                  title={showPassword ? "Sembunyikan password" : "Lihat password"}
                  disabled={loading}
                >
                  {showPassword ? (
                    /* MATA TERBUKA */
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    /* MATA TERTUTUP */
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c6.5 0 10 8 10 8a18.5 18.5 0 0 1-3.1 4.4" />
                      <path d="M6.6 6.6C3.7 8.5 2 12 2 12s3.5 8 10 8c1.5 0 2.9-.4 4.1-1" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* =================================================
                OPTIONS
            ================================================== */}
            <div className="form-options">
              {/* INGAT SAYA */}
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span>Ingat Saya</span>
              </label>

              {/* LUPA PASSWORD */}
              <a
                href="#forgot"
                className="forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Fitur lupa password belum tersedia.");
                }}
              >
                Lupa Password?
              </a>
            </div>

            {/* =================================================
                LOGIN BUTTON
            ================================================== */}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Proses Login..." : "Login / Masuk"}
            </button>
          </form>

          {/* REGISTER */}
          <p className="signup-text">
            Belum punya akun?{" "}
            <Link to="/register">Daftar Sekarang</Link>
          </p>
        </div>

        {/* =================================================
            BAGIAN KANAN
        ================================================== */}
        <div className="login-right">
          {/* PAW BADGE */}
          <div className="paw-badge">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 11.5c-1.8 0-3.5 1.4-3.5 3.3 0 2.2 2.3 4.2 3.5 5.2 1.2-1 3.5-3 3.5-5.2 0-1.9-1.7-3.3-3.5-3.3z" />
            </svg>
          </div>

          {/* IMAGE */}
          <div className="hero-illustration">
            <img
              src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=500"
              alt="Pet Care"
              className="illustration-img"
            />
          </div>

          {/* CONTENT */}
          <div className="hero-content">
            <h2>Layanan Terbaik Untuk Hewan Peliharaan Anda</h2>
            <p>
              Kelola kebutuhan perawatan, jadwal medis, dan grooming peliharaan
              kesayangan Anda dengan mudah.
            </p>

            {/* CAROUSEL DOTS */}
            <div className="carousel-dots">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;