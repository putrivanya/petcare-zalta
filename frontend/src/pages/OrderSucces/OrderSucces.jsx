import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import "./OrderSuccess.css";

function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Jika tidak ada data order, redirect ke home
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    if (orders.length === 0) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="order-success-page">
      <div className="success-container">
        <FaCheckCircle className="success-icon" />
        <h2>Pesanan Berhasil Dibuat!</h2>
        <p>Terima kasih, pesanan Anda sedang diproses.</p>
        <p>Silakan pantau status pesanan Anda di halaman "Pesanan Saya".</p>
        <div className="success-buttons">
          <Link to="/orders" className="btn-orders">
            Lihat Pesanan Saya
          </Link>
          <Link to="/shop" className="btn-shop">
            Lanjut Belanja
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;