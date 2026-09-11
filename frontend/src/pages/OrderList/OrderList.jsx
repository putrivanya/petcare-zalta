import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBox,
  FaTruck,
  FaCheck,
  FaClock,
  FaBan,
  FaEye,
} from "react-icons/fa";
import "./OrderList.css";

function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const saved = JSON.parse(localStorage.getItem("orders")) || [];
    // Urutkan dari yang terbaru
    saved.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setOrders(saved);
  };

  const formatRupiah = (value) => {
    return Number(value || 0).toLocaleString("id-ID");
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fungsi untuk mendapatkan label status dan warna
  const getStatusInfo = (status) => {
    switch (status) {
      case "menunggu":
        return { label: "Menunggu Konfirmasi", className: "status-waiting", icon: <FaClock /> };
      case "dikemas":
        return { label: "Dikemas", className: "status-packed", icon: <FaBox /> };
      case "dikirim":
        return { label: "Dikirim", className: "status-shipped", icon: <FaTruck /> };
      case "selesai":
        return { label: "Selesai", className: "status-completed", icon: <FaCheck /> };
      case "ditolak":
        return { label: "Ditolak", className: "status-rejected", icon: <FaBan /> };
      default:
        return { label: status || "Menunggu", className: "status-waiting", icon: <FaClock /> };
    }
  };

  // Simulasi update status (untuk demo, admin bisa ubah status dari sini)
  // Nanti akan dihubungkan dengan backend

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <h2>Pesanan Saya</h2>
          <div className="empty-orders">
            <p>Belum ada pesanan.</p>
            <Link to="/shop">Mulai Belanja</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h2>Pesanan Saya</h2>
        <div className="orders-list">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <div className="order-card" key={order.id}>
                <div className="order-header">
                  <span className="order-id">Pesanan #{order.id.slice(-6)}</span>
                  <span className={`order-status ${statusInfo.className}`}>
                    {statusInfo.icon} {statusInfo.label}
                  </span>
                </div>
                <div className="order-date">{formatDate(order.createdAt)}</div>
                <div className="order-items">
                  {order.items.map((item) => (
                    <div className="order-item" key={item.id}>
                      <img src={item.image} alt={item.name} />
                      <div>
                        <p>{item.name}</p>
                        <span>
                          {item.quantity} x Rp {formatRupiah(item.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <strong>Rp {formatRupiah(order.total)}</strong>
                  </div>
                  <div className="order-actions">
                    <Link to={`/order/${order.id}`} className="btn-detail">
                      <FaEye /> Detail
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default OrderList;