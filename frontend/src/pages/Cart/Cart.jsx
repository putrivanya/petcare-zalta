import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTrash, FaArrowLeft, FaCreditCard, FaMinus, FaPlus, FaShoppingCart,
  FaMoneyBillWave, FaList, FaBox, FaTruck, FaCheck, FaClock, FaBan,
  FaEye, FaStar, FaStarHalfAlt, FaPaw, FaCat, FaDog, FaBone,
} from "react-icons/fa";
import "./Cart.css";

// ============================================================
// 1. KOMPONEN TOAST
// ============================================================
const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type || "info"}`}
          onClick={() => onRemove(toast.id)}
        >
          <div className="toast-icon">
            {toast.type === "success" && <FaCheck />}
            {toast.type === "error" && <FaBan />}
            {toast.type === "info" && <FaClock />}
            {toast.type === "warning" && <FaClock />}
          </div>
          <div className="toast-message">{toast.message}</div>
          <button
            className="toast-close"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(toast.id);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

// ============================================================
// 2. KOMPONEN CONFIRM DIALOG
// ============================================================
const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel, title = "Konfirmasi" }) => {
  if (!isOpen) return null;
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn confirm-btn-cancel" onClick={onCancel}>
            Batal
          </button>
          <button className="confirm-btn confirm-btn-confirm" onClick={onConfirm}>
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 3. KOMPONEN MODAL REVIEW
// ============================================================
const ReviewModal = ({ isOpen, order, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (isOpen) {
      setRating(5);
      setComment("");
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Pilih minimal 1 bintang.");
      return;
    }
    onSubmit(order.id || order._id, { rating, comment });
    onClose();
  };

  return (
    <div className="review-overlay" onClick={onClose}>
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        <h3><FaStar style={{ color: "#f59e0b" }} /> Beri Review</h3>
        <p>Pesanan #{String(order.id || order._id).slice(-8)}</p>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{ cursor: "pointer", fontSize: "32px", color: star <= rating ? "#f59e0b" : "#d1d5db" }}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          placeholder="Tulis komentar (opsional)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="3"
        />
        <div className="review-actions">
          <button className="review-btn cancel" onClick={onClose}>Batal</button>
          <button className="review-btn submit" onClick={handleSubmit}>Kirim Review</button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 4. KOMPONEN UTAMA CART
// ============================================================
function Cart() {
  const navigate = useNavigate();

  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: "",
    title: "Konfirmasi",
    onConfirm: null,
  });
  const [view, setView] = useState("cart");
  const [orderTab, setOrderTab] = useState("semua");
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingOrders, setFetchingOrders] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewOrder, setReviewOrder] = useState(null);

  const [form, setForm] = useState({
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMethod: "cod",
    notes: "",
  });

  // ============================================
  // TOAST & CONFIRM
  // ============================================
  const showToast = (message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showConfirm = (message, onConfirm, title = "Konfirmasi") => {
    setConfirmState({ isOpen: true, message, title, onConfirm });
  };

  const handleConfirm = () => {
    if (confirmState.onConfirm) confirmState.onConfirm();
    setConfirmState({ isOpen: false, message: "", title: "Konfirmasi", onConfirm: null });
  };

  const handleCancelConfirm = () => {
    setConfirmState({ isOpen: false, message: "", title: "Konfirmasi", onConfirm: null });
  };

  // ============================================
  // HELPER GAMBAR
  // ============================================
  const getImageUrl = (item) => {
    if (!item) return null;
    const imgPath =
      item.image ||
      item.imageUrl ||
      item.img ||
      item.photo ||
      item.gambar ||
      item.productImage ||
      "";
    if (!imgPath) return null;
    if (
      imgPath.startsWith("http://") ||
      imgPath.startsWith("https://") ||
      imgPath.startsWith("data:")
    ) {
      return imgPath;
    }
    return `http://localhost:5000${imgPath.startsWith("/") ? "" : "/"}${imgPath}`;
  };

  const ProductImage = ({ item, alt, className }) => {
    const src = getImageUrl(item);
    if (src) {
      return (
        <img
          src={src}
          alt={alt || "Produk"}
          className={className}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentNode.querySelector(".fallback-icon").style.display = "flex";
          }}
        />
      );
    }
    return (
      <div
        className={`fallback-icon ${className || ""}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#dbeafe",
          borderRadius: "8px",
          color: "#2563eb",
          fontSize: "28px",
        }}
      >
        <FaDog />
      </div>
    );
  };

  // ============================================
  // LOAD DATA
  // ============================================
  useEffect(() => {
    loadCart();
    loadOrders();
  }, []);

  // ✅ useEffect: auto-fill saat view berubah ke "checkout"
  useEffect(() => {
    if (view !== "checkout") return;

    try {
      const rawUser =
        localStorage.getItem("user") ||
        localStorage.getItem("currentUser");

      if (rawUser) {
        const user = JSON.parse(rawUser);
        setForm((prev) => ({
          ...prev,
          address: user.alamat || prev.address,
          phone: user.no_telpon || prev.phone,
        }));
      }
    } catch (err) {
      console.error("Gagal parse user:", err);
    }
  }, [view]);

  const loadCart = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart"));
      if (Array.isArray(saved)) {
        const fixed = saved.map((item) => ({
          ...item,
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0,
        }));
        setCartItems(fixed);
      } else {
        setCartItems([]);
      }
    } catch {
      setCartItems([]);
    }
  };

  // ============================================================
  // ✅ LOAD ORDERS — DENGAN NOTIFIKASI YANG SUDAH DIPERBAIKI
  // ============================================================
  const loadOrders = async () => {
    setFetchingOrders(true);
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      if (!token) {
        setOrders([]);
        setFetchingOrders(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const resData = data.data || data;
        if (Array.isArray(resData)) {
          const myOrders = resData.filter((item) => {
            if (user && user.id) return item.userId === user.id || item.userEmail === user.email;
            if (user && user.email) return item.userEmail === user.email;
            return true;
          });
          myOrders.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
          setOrders(myOrders);

          // ✅ FILTER PESANAN YANG SUDAH SELESAI
          const completedOrders = myOrders.filter(
            (o) => (o.status || "").toLowerCase() === "selesai"
          );

          // ✅ AMBIL LIST ID YANG SUDAH PERNAH DINOTIFIKASI
          // Konversi semua ke String biar konsisten tipenya
          let notifiedIds = [];
          try {
            const raw = JSON.parse(localStorage.getItem("notifiedCompletedOrders") || "[]");
            notifiedIds = Array.isArray(raw) ? raw.map(String) : [];
          } catch {
            notifiedIds = [];
          }

          const newNotified = [...notifiedIds];
          let hasNewNotification = false;

          completedOrders.forEach((order) => {
            // ✅ KONVERSI ID KE STRING — biar konsisten
            const rawId = order.id ?? order._id;
            const idStr = rawId !== undefined && rawId !== null ? String(rawId) : null;

            if (!idStr) return;

            // ✅ CEK APAKAH SUDAH PERNAH DINOTIFIKASI
            if (!notifiedIds.includes(idStr)) {
              const shortId = idStr.slice(-8);

              // ✅ TOAST 1 — "Sudah diantar"
              showToast(
                `✅ Pesanan #${shortId} sudah di antar. Terima kasih sudah belanja di PetCare Hub Zalta!`,
                "success",
                6000
              );

              // ✅ TOAST 2 (delay 1.5 detik) — "Jangan lupa review"
              setTimeout(() => {
                showToast(
                  `⭐ Jangan lupa beri review untuk pesanan #${shortId} ya!`,
                  "info",
                  6000
                );
              }, 1500);

              newNotified.push(idStr);
              hasNewNotification = true;
            }
          });

          if (hasNewNotification) {
            localStorage.setItem("notifiedCompletedOrders", JSON.stringify(newNotified));
          }
        } else {
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
      setOrders([]);
    } finally {
      setFetchingOrders(false);
    }
  };

  // ============================================
  // CART FUNCTIONS
  // ============================================
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const updateQuantity = (id, change) => {
    const updated = cartItems
      .map((item) => {
        if (item.id === id) {
          const newQty = Number(item.quantity) + change;
          if (newQty <= 0) return null;
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter(Boolean);
    saveCart(updated);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    saveCart(updated);
    showToast("Produk dihapus dari keranjang.", "info");
  };

  const clearCart = () => {
    if (cartItems.length === 0) {
      showToast("Keranjang sudah kosong.", "info");
      return;
    }
    showConfirm("Hapus semua produk dari keranjang?", () => {
      setCartItems([]);
      localStorage.removeItem("cart");
      showToast("Keranjang telah dikosongkan.", "info");
    }, "Kosongkan Keranjang");
  };

  // ============================================
  // CHECKOUT — DENGAN AUTO-FILL
  // ============================================
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast("Keranjang kosong. Tambahkan produk dulu!", "warning");
      return;
    }

    try {
      const rawUser =
        localStorage.getItem("user") ||
        localStorage.getItem("currentUser");

      if (rawUser) {
        const user = JSON.parse(rawUser);
        setForm((prev) => ({
          ...prev,
          address: user.alamat || prev.address,
          phone: user.no_telpon || prev.phone,
        }));
      }
    } catch (err) {
      console.error("Gagal parse user dari localStorage:", err);
    }

    setView("checkout");
  };

  // ============================================
  // HANDLE FORM CHANGE
  // ============================================
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "postalCode" || name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [name]: onlyNumbers }));
      return;
    }

    if (name === "notes") {
      const cleanNotes = value.replace(/[^a-zA-Z0-9\s.,?!\-']/g, "");
      setForm((prev) => ({ ...prev, [name]: cleanNotes }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ============================================
  // PLACE ORDER
  // ============================================
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!form.address || !form.city || !form.phone) {
      showToast("Harap isi alamat, kota, dan nomor telepon.", "warning");
      return;
    }

    if (!/^\d+$/.test(form.phone)) {
      showToast("Nomor telepon hanya boleh berisi angka.", "warning");
      return;
    }
    if (form.postalCode && !/^\d+$/.test(form.postalCode)) {
      showToast("Kode pos hanya boleh berisi angka.", "warning");
      return;
    }
    if (form.phone.length < 10) {
      showToast("Nomor telepon minimal 10 digit.", "warning");
      return;
    }
    if (form.postalCode && form.postalCode.length < 5) {
      showToast("Kode pos minimal 5 digit (jika diisi).", "warning");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Silakan login terlebih dahulu!", "warning");
      navigate("/login");
      return;
    }

    setLoading(true);

    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : {};

    const itemsPayload = cartItems.map((item) => ({
      id: item.id || item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || item.imageUrl || item.img || item.photo || item.gambar || "",
      category: item.category || "",
    }));

    const payload = {
      items: itemsPayload,
      total: total,
      address: form.address,
      city: form.city,
      postalCode: form.postalCode,
      phone: form.phone,
      paymentMethod: "COD",
      notes: form.notes,
      status: "menunggu",
      paymentStatus: "belum_bayar",
      userName: user.name || user.nama || "User " + form.phone,
      userEmail: user.email || "user@example.com",
      userPhone: form.phone,
      itemName: cartItems.map((i) => i.name).join(", "),
      type: "Produk",
      quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      price: total,
    };

    try {
      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        localStorage.removeItem("cart");
        setCartItems([]);
        setForm({
          address: "",
          city: "",
          postalCode: "",
          phone: "",
          paymentMethod: "cod",
          notes: "",
        });
        await loadOrders();
        setView("orders");
        showToast("Pesanan berhasil dibuat! ", "success");
      } else {
        const errRes = await response.json();
        showToast("Gagal membuat pesanan: " + (errRes.message || "Terjadi kesalahan"), "error");
      }
    } catch (error) {
      console.error("Gagal konek ke backend:", error);
      showToast("Gagal terhubung ke server backend.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    showConfirm("Apakah Anda yakin ingin membatalkan pesanan ini?", async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:5000/api/transactions/${orderId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          showToast("Pesanan berhasil dibatalkan!", "success");
          loadOrders();
          if (view === "detail") setView("orders");
        } else {
          const errData = await response.json();
          showToast("Gagal membatalkan pesanan: " + (errData.message || "Kesalahan server"), "error");
        }
      } catch (error) {
        console.error("Error cancel order:", error);
        showToast("Gagal menghapus pesanan dari server.", "error");
      }
    }, "Batalkan Pesanan");
  };

  // ============================================
  // REVIEW HANDLER
  // ============================================
  const openReviewModal = (order) => {
    setReviewOrder(order);
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (orderId, reviewData) => {
    const order = orders.find((o) => (o.id || o._id) === orderId);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          transactionId: orderId,
          userName: order?.userName,
          rating: reviewData.rating,
          comment: reviewData.comment,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast(result.message || "Terima kasih atas review Anda!", "success");
        await loadOrders();
      } else {
        showToast(result.message || "Gagal menyimpan review.", "error");
      }
    } catch (error) {
      console.error("Gagal mengirim review:", error);
      showToast("Gagal terhubung ke server backend.", "error");
    }
  };

  // ============================================
  // HELPERS
  // ============================================
  const viewOrderDetail = (order) => {
    setSelectedOrder(order);
    setView("detail");
  };

  const backToOrders = () => {
    setSelectedOrder(null);
    setView("orders");
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

  const getStatusInfo = (order) => {
    const status = (order?.status || "").toLowerCase();
    const paymentMethod = order?.paymentMethod || "";
    if (status === "menunggu" || status === "pending") {
      return {
        label: paymentMethod === "COD" ? "Menunggu Konfirmasi" : "Menunggu Pembayaran",
        className: "status-waiting",
        icon: <FaClock />,
        code: "menunggu",
      };
    }
    switch (status) {
      case "dikemas":
      case "proses":
        return { label: "Dikemas", className: "status-packed", icon: <FaBox />, code: "dikemas" };
      case "dikirim":
        return { label: "Dikirim", className: "status-shipped", icon: <FaTruck />, code: "dikirim" };
      case "selesai":
      case "success":
        return { label: "Selesai", className: "status-completed", icon: <FaCheck />, code: "selesai" };
      case "ditolak":
      case "batal":
      case "cancelled":
        return { label: "Dibatalkan", className: "status-rejected", icon: <FaBan />, code: "batal" };
      default:
        return { label: status || "Menunggu", className: "status-waiting", icon: <FaClock />, code: "menunggu" };
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (orderTab === "semua") return true;
    const info = getStatusInfo(order);
    return info.code === orderTab;
  });

  // ============================================
  // RENDER CART
  // ============================================
  const renderCart = () => {
    const totalBarang = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);
    const totalHarga = cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

    if (cartItems.length === 0) {
      return (
        <div className="cart-page">
          <div className="cart-container">
            <div className="cart-header">
              <div>
                <h2><FaPaw className="header-icon" /> Keranjang Belanja</h2>
                <p>Periksa kembali barang yang ingin kamu pesan.</p>
              </div>
              <div className="header-actions">
                <button className="btn-orders-link" onClick={() => { loadOrders(); setView("orders"); }}>
                  <FaList /> Pesanan Saya
                </button>
              </div>
            </div>
            <div className="empty-cart">
              <div className="empty-icon"><FaShoppingCart /></div>
              <h3>Keranjang masih kosong</h3>
              <p>Belum ada produk yang ditambahkan ke keranjang.</p>
              <Link to="/dashboard" className="btn-back-shop">
                <FaArrowLeft /> Kembali ke Dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <div>
              <h2><FaPaw className="header-icon" /> Keranjang Belanja</h2>
              <p>{totalBarang} barang ada di keranjang kamu</p>
            </div>
            <div className="header-actions">
              <button className="btn-orders-link" onClick={() => { loadOrders(); setView("orders"); }}>
                <FaList /> Pesanan Saya
              </button>
            </div>
          </div>

          <div className="cart-content">
            <div className="cart-left">
              <div className="cart-list">
                {cartItems.map((item) => (
                  <div className="cart-item" key={item.id || item._id}>
                    <div className="cart-image">
                      <ProductImage item={item} alt={item.name} className="cart-img" />
                    </div>
                    <div className="item-details">
                      <h4><FaDog className="item-icon" /> {item.name}</h4>
                      {item.category && <span className="item-category">{item.category}</span>}
                      <p className="item-price">Rp {formatRupiah(item.price)}</p>
                    </div>
                    <div className="qty-control">
                      <button onClick={() => updateQuantity(item.id, -1)}><FaMinus /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}><FaPlus /></button>
                    </div>
                    <div className="item-subtotal">
                      Rp {formatRupiah(Number(item.price) * Number(item.quantity))}
                    </div>
                    <button className="btn-remove" onClick={() => removeItem(item.id)} title="Hapus">
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-summary">
              <h3><FaBone className="section-icon" /> Ringkasan Pesanan</h3>
              <div className="summary-row"><span>Total barang</span><span>{totalBarang} barang</span></div>
              <div className="summary-row"><span>Total harga</span><span>Rp {formatRupiah(totalHarga)}</span></div>
              <div className="payment-info">
                <div className="payment-icon"><FaCreditCard /></div>
                <div><strong>Pilihan Pembayaran</strong><p>COD (Bayar di Tempat) – hanya metode ini yang tersedia.</p></div>
              </div>
              <div className="payment-method-preview">
                <span><FaMoneyBillWave /> COD</span>
              </div>
              <hr />
              <div className="summary-total">
                <span>Total Pembayaran</span>
                <strong>Rp {formatRupiah(totalHarga)}</strong>
              </div>
              <button className="btn-checkout" onClick={handleCheckout} style={{ backgroundColor: "#0000FF" }}>
                <FaCreditCard /> Lanjut Checkout
              </button>
              <Link to="/dashboard" className="continue-shopping"><FaArrowLeft /> Lanjut Belanja</Link>
            </div>
          </div>

          <div className="cart-clear-bottom">
            <button className="btn-clear-all-bottom" onClick={clearCart}>
              <FaTrash /> Hapus Semua
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER CHECKOUT
  // ============================================
  const renderCheckout = () => {
    const totalHarga = cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-header">
            <button className="back-btn" onClick={() => setView("cart")}><FaArrowLeft /> Kembali</button>
            <h2><FaPaw className="header-icon" /> Checkout</h2>
          </div>
          <div className="checkout-grid">
            <form className="checkout-form" onSubmit={handlePlaceOrder}>
              <div className="form-section">
                <h3><FaCat className="section-icon" /> Alamat Pengiriman</h3>
                <div className="form-group">
                  <label>Alamat Lengkap *</label>
                  <textarea name="address" value={form.address} onChange={handleFormChange} required rows="3" placeholder="Jalan, nomor rumah, blok..." />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Kota *</label>
                    <input type="text" name="city" value={form.city} onChange={handleFormChange} required placeholder="Kota" />
                  </div>
                  <div className="form-group">
                    <label>Kode Pos</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleFormChange}
                      placeholder="Kode Pos"
                      maxLength="10"
                      title="Hanya angka"
                      autoComplete="postal-code"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Nomor Telepon *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                    required
                    placeholder="08xxx"
                    maxLength="15"
                    title="Hanya angka, minimal 10 digit"
                    autoComplete="tel"
                  />
                </div>
              </div>
              <div className="form-section">
                <h3><FaMoneyBillWave className="section-icon" /> Metode Pembayaran</h3>
                <div className="payment-options">
                  <div className="payment-option active">
                    <FaMoneyBillWave className="option-icon" />
                    <span className="option-label">COD (Bayar di Tempat)</span>
                    <span className="option-sub">✓</span>
                  </div>
                  <p className="payment-note">Pembayaran dilakukan saat barang tiba di alamat Anda.</p>
                </div>
              </div>
              <div className="form-section">
                <h3><FaBone className="section-icon" /> Catatan (Opsional)</h3>
                <div className="form-group">
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleFormChange}
                    rows="2"
                    placeholder="Catatan untuk penjual"
                  />
                  <small style={{ color: "#6c7a89", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    Hanya huruf, angka, spasi, dan tanda baca dasar (.,?!-')
                  </small>
                </div>
              </div>
              <button type="submit" className="btn-confirm" disabled={loading} style={{ backgroundColor: "#0000FF" }}>
                {loading ? "Menyimpan..." : <><FaCheck /> Buat Pesanan</>}
              </button>
            </form>
            <div className="checkout-summary">
              <h3><FaBone className="section-icon" /> Ringkasan Pesanan</h3>
              <div className="summary-items">
                {cartItems.map((item) => (
                  <div className="summary-item" key={item.id || item._id}>
                    <ProductImage item={item} alt={item.name} className="summary-img" />
                    <div className="item-info">
                      <p>{item.name}</p>
                      <span>{item.quantity} x Rp {formatRupiah(item.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <hr />
              <div className="checkout-total">
                <span>Total</span>
                <strong>Rp {formatRupiah(totalHarga)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER ORDERS
  // ============================================
  const renderOrders = () => {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-header">
            <h2><FaPaw className="header-icon" /> Pesanan Saya</h2>
            <div className="header-actions">
              <button
                className="back-btn"
                onClick={() => setView("cart")}
                style={{ backgroundColor: "#0000FF", color: "#fff", borderRadius: "8px", padding: "8px 16px" }}
              >
                <FaArrowLeft /> Kembali ke Keranjang
              </button>
            </div>
          </div>

          <div className="orders-tabs">
            {[
              { key: "semua",    label: "Semua" },
              { key: "menunggu", label: "Menunggu" },
              { key: "dikemas",  label: "Dikemas" },
              { key: "dikirim",  label: "Dikirim" },
              { key: "selesai",  label: "Selesai" },
              { key: "batal",    label: "Batal" },
            ].map((tab) => (
              <button
                key={tab.key}
                className={orderTab === tab.key ? "active" : ""}
                onClick={() => setOrderTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {fetchingOrders ? (
            <div className="loading-orders">Memuat data pesanan...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-orders">
              <p>Tidak ada pesanan pada kategori ini.</p>
              <button
                className="btn-shop-now"
                onClick={() => navigate("/dashboard")}
                style={{ backgroundColor: "#0000FF" }}
              >
                Kembali ke Dashboard
              </button>
            </div>
          ) : (
            <div className="orders-grid">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order);
                const itemsArr = Array.isArray(order.items) ? order.items : [];
                const orderIdStr = String(order.id || order._id || "");
                const firstItem = itemsArr.length > 0 ? itemsArr[0] : order;
                const isCompleted = statusInfo.code === "selesai";

                return (
                  <div className="order-card-grid" key={order.id || order._id}>
                    <div className="order-card-image">
                      <ProductImage item={firstItem} alt={firstItem.name || order.itemName} className="order-img" />
                    </div>

                    <div className="order-card-body">
                      <div className="order-card-header">
                        <span className="order-id">#{orderIdStr.slice(-8)}</span>
                        <span className={`order-status ${statusInfo.className}`}>
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                      </div>
                      <div className="order-card-date">{formatDate(order.createdAt || order.date)}</div>

                      <div className="order-card-items">
                        {itemsArr.length > 0 ? (
                          itemsArr.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="order-card-item">
                              <span>{item.name || order.itemName}</span>
                              <span>{item.quantity || order.quantity} x Rp {formatRupiah(item.price || order.price)}</span>
                            </div>
                          ))
                        ) : (
                          <div className="order-card-item">
                            <span>{order.itemName || "Produk PetCare"}</span>
                            <span>{order.quantity || 1} x Rp {formatRupiah(order.price || order.total)}</span>
                          </div>
                        )}
                        {itemsArr.length > 2 && <div className="order-card-more">+{itemsArr.length - 2} produk lainnya</div>}
                      </div>

                      <div className="order-card-footer">
                        <div className="order-card-total">
                          <span>Total: </span>
                          <strong>Rp {formatRupiah(order.total || order.price)}</strong>
                        </div>
                        <div className="order-card-actions">
                          <button
                            className="btn-detail"
                            onClick={() => viewOrderDetail(order)}
                            style={{ backgroundColor: "#0000FF", color: "#fff" }}
                          >
                            <FaEye /> Detail
                          </button>
                          {(order.status === "menunggu" || order.status === "pending") && (
                            <button
                              className="btn-cancel"
                              onClick={() => handleCancelOrder(order.id || order._id)}
                              style={{ backgroundColor: "#dc3545", color: "#fff" }}
                            >
                              <FaTrash /> Batal
                            </button>
                          )}
                          {isCompleted && !order.isReviewed && (
                            <button
                              className="btn-review"
                              onClick={() => openReviewModal(order)}
                              style={{ backgroundColor: "#f59e0b", color: "#fff" }}
                            >
                              <FaStar /> Review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER DETAIL
  // ============================================
  const renderOrderDetail = () => {
    if (!selectedOrder) return null;
    const statusInfo = getStatusInfo(selectedOrder);

    return (
      <div className="order-detail-page">
        <div className="detail-container">
          <button className="back-link" onClick={backToOrders} style={{ color: "#0000FF" }}>
            <FaArrowLeft /> Kembali ke Pesanan
          </button>
          <h2><FaPaw className="header-icon" /> Detail Pesanan #{String(selectedOrder.id || selectedOrder._id || "").slice(-8)}</h2>
          <div className="detail-card">
            <div className="detail-row">
              <span className="label">Status Pesanan</span>
              <span className={`order-status ${statusInfo.className}`}>
                {statusInfo.icon} {statusInfo.label}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Metode Pembayaran</span>
              <span style={{ fontWeight: 500, color: "#1e293b" }}>COD (Bayar di Tempat)</span>
            </div>
            <div className="detail-row">
              <span className="label">Tanggal</span>
              <span>{formatDate(selectedOrder.createdAt || selectedOrder.date)}</span>
            </div>
            <div className="detail-row">
              <span className="label">Total</span>
              <strong style={{ color: "#2563eb", fontSize: "18px" }}>Rp {formatRupiah(selectedOrder.total || selectedOrder.price)}</strong>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER UTAMA
  // ============================================
  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        message={confirmState.message}
        title={confirmState.title}
        onConfirm={handleConfirm}
        onCancel={handleCancelConfirm}
      />
      <ReviewModal
        isOpen={showReviewModal}
        order={reviewOrder}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleReviewSubmit}
      />
      <div>
        {view === "cart" && renderCart()}
        {view === "checkout" && renderCheckout()}
        {view === "orders" && renderOrders()}
        {view === "detail" && renderOrderDetail()}
      </div>
    </>
  );
}

export default Cart;