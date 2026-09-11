import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 👈 IMPORT UNTUK NAVIGASI
import "./BookingStatus.css";

const API_URL = "http://localhost:5000/api";

// ===== FORMAT PRICE =====
const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(price || 0));
};

// ===== STATUS MAPPING =====
const getStatusInfo = (status) => {
  switch (status) {
    case "menunggu":
      return {
        label: "Menunggu Konfirmasi",
        icon: "⏳",
        color: "#f59e0b",
        bg: "#fffbeb",
        border: "#fcd34d",
        instruction: "Pesanan sedang ditinjau oleh admin. Mohon tunggu.",
      };
    case "dikemas":
      return {
        label: "✅ Disetujui",
        icon: "✅",
        color: "#059669",
        bg: "#ecfdf5",
        border: "#34d399",
        instruction:
          "Booking Anda telah disetujui! Silahkan antar hewan peliharaan Anda ke PetCare Zalta terdekat.",
      };
    case "dikirim":
      return {
        label: "📦 Dikirim",
        icon: "📦",
        color: "#3b82f6",
        bg: "#eff6ff",
        border: "#60a5fa",
        instruction: "Pesanan sedang dalam perjalanan.",
      };
    case "selesai":
      return {
        label: "🎉 Selesai",
        icon: "🎉",
        color: "#16a34a",
        bg: "#f0fdf4",
        border: "#4ade80",
        instruction: "Layanan telah selesai. Terima kasih telah menggunakan PetCare Zalta!",
      };
    case "ditolak":
      return {
        label: "❌ Ditolak",
        icon: "❌",
        color: "#dc2626",
        bg: "#fef2f2",
        border: "#fca5a5",
        instruction: "Booking ditolak oleh admin. Silakan hubungi kami untuk info lebih lanjut.",
      };
    case "dibatalkan":
      return {
        label: "🚫 Dibatalkan",
        icon: "🚫",
        color: "#6b7280",
        bg: "#f3f4f6",
        border: "#9ca3af",
        instruction: "Booking ini telah dibatalkan.",
      };
    default:
      return {
        label: status || "Status Tidak Dikenal",
        icon: "❓",
        color: "#6b7280",
        bg: "#f3f4f6",
        border: "#9ca3af",
        instruction: "",
      };
  }
};

// ===== KOMPONEN UTAMA =====
const BookingStatus = () => {
  const navigate = useNavigate(); // 👈 HOOK NAVIGASI
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError("");

      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        setError("Silakan login terlebih dahulu.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const user = JSON.parse(userStr);
      const userEmail = user.email || "";

      if (!userEmail) {
        setError("Email user tidak ditemukan. Silakan login ulang.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const response = await fetch(`${API_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Gagal mengambil data (${response.status})`);
      }

      const result = await response.json();
      let allTransactions = [];
      if (Array.isArray(result)) allTransactions = result;
      else if (result.data && Array.isArray(result.data)) allTransactions = result.data;
      else allTransactions = [];

      const userBookings = allTransactions.filter(
        (item) => item.userEmail && item.userEmail.toLowerCase() === userEmail.toLowerCase()
      );

      userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(userBookings);
    } catch (err) {
      console.error("❌ Error fetch bookings:", err);
      setError(err.message || "Gagal memuat data booking.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(() => fetchBookings(true), 5000);
    return () => clearInterval(interval);
  }, []);

  // ===== RENDER =====
  if (loading) {
    return (
      <div className="booking-status-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Memuat data booking...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="booking-status-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Oops! Terjadi kesalahan</h3>
          <p>{error}</p>
          <button className="btn-retry" onClick={() => fetchBookings()}>
            🔄 Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-status-container">
      {/* HEADER DENGAN TOMBOL KEMBALI */}
      <div className="page-header">
        <div className="header-left">
          {/* 👇 TOMBOL KEMBALI */}
          <button className="btn-back" onClick={() => navigate(-1)}>
            ← Kembali
          </button>
          <div>
            <h1>📋 Booking Saya</h1>
            <p className="subtitle">
              Pantau status booking, pembayaran, dan instruksi dari admin.
            </p>
          </div>
        </div>
        <div className="header-right">
          <span className="booking-count">
            {bookings.length} {bookings.length === 1 ? "Booking" : "Booking"}
          </span>
          <button
            className={`btn-refresh ${refreshing ? "spinning" : ""}`}
            onClick={() => fetchBookings(true)}
            disabled={refreshing}
          >
            🔄
          </button>
        </div>
      </div>

      {/* LIST BOOKING */}
      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration">🐾</div>
          <h3>Belum Ada Booking</h3>
          <p>Anda belum melakukan booking layanan apapun.</p>
          <button
            className="btn-primary"
            onClick={() => (window.location.href = "/grooming")}
          >
            + Booking Sekarang
          </button>
        </div>
      ) : (
        <div className="booking-grid">
          {bookings.map((item) => {
            const statusInfo = getStatusInfo(item.status);
            const isPaid = item.paymentStatus === "dibayar";

            return (
              <div className="booking-card" key={item.id}>
                <div
                  className="status-badge"
                  style={{
                    background: statusInfo.bg,
                    color: statusInfo.color,
                    borderColor: statusInfo.border,
                  }}
                >
                  {statusInfo.icon} {statusInfo.label}
                </div>

                <div className="card-body">
                  <div className="service-header">
                    <h2 className="service-name">{item.itemName || item.name || "Layanan"}</h2>
                    <span className="service-type">
                      {item.type || "Layanan"}
                    </span>
                  </div>

                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">🐶 Hewan</span>
                      <span className="detail-value">{item.userName || "-"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">📅 Tanggal</span>
                      <span className="detail-value">{item.date || "-"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">⏰ Waktu</span>
                      <span className="detail-value">{item.time || "-"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">💳 Metode</span>
                      <span className="detail-value">{item.paymentMethod || "COD"}</span>
                    </div>
                  </div>

                  <div className="price-section">
                    <span className="price-label">Total Harga</span>
                    <span className="price-value">{formatPrice(item.total || item.price || 0)}</span>
                  </div>

                  {statusInfo.instruction && (
                    <div
                      className="status-instruction"
                      style={{
                        background: statusInfo.bg,
                        borderColor: statusInfo.border,
                        color: statusInfo.color,
                      }}
                    >
                      <span className="instruction-icon">{statusInfo.icon}</span>
                      <span>{statusInfo.instruction}</span>
                    </div>
                  )}

                  <div className="payment-status-row">
                    <span className={`payment-badge ${isPaid ? "paid" : "unpaid"}`}>
                      {isPaid ? "✅ Lunas" : "⏳ Belum Bayar"}
                    </span>
                    <span className="booking-id">#ID: {item.id}</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    className="btn-detail"
                    onClick={() => alert(`Detail booking #${item.id}\nLayanan: ${item.itemName}\nTotal: ${formatPrice(item.total)}`)}
                  >
                    📄 Detail
                  </button>
                  {!isPaid && item.status === "dikemas" && (
                    <button
                      className="btn-pay"
                      onClick={() => alert("Fitur pembayaran akan segera hadir!")}
                    >
                      💳 Bayar Sekarang
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingStatus;