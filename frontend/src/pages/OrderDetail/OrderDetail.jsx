import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./OrderDetail.css";

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const found = orders.find((o) => o.id === id);
    setOrder(found || null);
  }, [id]);

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

  if (!order) {
    return (
      <div className="order-detail-page">
        <p>Pesanan tidak ditemukan.</p>
        <Link to="/orders">Kembali ke Pesanan</Link>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <div className="detail-container">
        <Link to="/orders" className="back-link">
          <FaArrowLeft /> Kembali
        </Link>
        <h2>Detail Pesanan #{order.id.slice(-6)}</h2>
        <div className="detail-card">
          <div className="detail-row">
            <span>Status</span>
            <span className="order-status">{order.status}</span>
          </div>
          <div className="detail-row">
            <span>Tanggal</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div className="detail-row">
            <span>Alamat</span>
            <span>{order.address}, {order.city}</span>
          </div>
          <div className="detail-row">
            <span>Telepon</span>
            <span>{order.phone}</span>
          </div>
          <div className="detail-row">
            <span>Pembayaran</span>
            <span>{order.paymentMethod}</span>
          </div>
          {order.notes && (
            <div className="detail-row">
              <span>Catatan</span>
              <span>{order.notes}</span>
            </div>
          )}
          <hr />
          <div className="detail-items">
            {order.items.map((item) => (
              <div className="detail-item" key={item.id}>
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
          <hr />
          <div className="detail-total">
            <span>Total</span>
            <strong>Rp {formatRupiah(order.total)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;