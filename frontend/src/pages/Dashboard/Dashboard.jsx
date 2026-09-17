import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Dashboard.css";

import {
  FaPaw, FaSearch, FaShoppingCart, FaBell, FaSignOutAlt, FaDog, FaCat,
  FaFish, FaDove, FaBox, FaHome, FaCut, FaUserMd, FaHeart, FaMapMarkerAlt,
  FaPhone, FaEnvelope, FaClock, FaInstagram, FaFacebook, FaWhatsapp,
  FaArrowRight, FaTimes, FaBars, FaCheckCircle, FaChevronLeft, FaChevronRight,
  FaCheck, FaBan, FaBone, FaPuzzlePiece, FaCapsules, FaTshirt, FaTooth,
  FaUtensils, FaUserCircle, FaSpinner, FaStar, FaStarHalfAlt, FaRegStar,
  FaQuoteLeft, FaRegSmile, FaRegFrown, FaRegMeh, FaRegLaugh, FaRegAngry,
  FaComment, FaEye, FaChevronDown, FaChevronUp,
  FaHotel, FaFileMedical, FaNotesMedical, FaStethoscope, FaSyringe,
  FaCalendarAlt,
} from "react-icons/fa";

// =====================================================
// TOAST
// =====================================================
const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts.length) return null;
  return (
    <div
      className="toast-container"
      style={{
        position: "fixed", top: "20px", right: "20px", zIndex: 9999,
        display: "flex", flexDirection: "column", gap: "12px",
        maxWidth: "420px", width: "100%", pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type || "info"}`}
          onClick={() => onRemove(toast.id)}
          style={{
            display: "flex", alignItems: "center", gap: "14px",
            background: "#ffffff", padding: "16px 20px", borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.04)",
            borderLeft: `6px solid ${toast.type === "success" ? "#22c55e" : toast.type === "error" ? "#ef4444" : "#3b82f6"}`,
            cursor: "pointer", transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            pointerEvents: "auto", width: "100%", animation: "slideInRight 0.4s ease-out",
            backdropFilter: "blur(4px)", backgroundColor: "rgba(255,255,255,0.95)",
          }}
        >
          <div className="toast-icon" style={{ fontSize: "28px", color: toast.type === "success" ? "#22c55e" : toast.type === "error" ? "#ef4444" : "#3b82f6", flexShrink: 0 }}>
            {toast.type === "success" && <FaCheckCircle />}
            {toast.type === "error" && <FaBan />}
            {toast.type === "info" && <FaClock />}
            {toast.type === "warning" && <FaSpinner />}
          </div>
          <div className="toast-message" style={{ flex: 1, fontSize: "15px", color: "#1e293b", fontWeight: 500, lineHeight: 1.4 }}>
            {toast.message}
          </div>
          <button className="toast-close" onClick={(e) => { e.stopPropagation(); onRemove(toast.id); }}
            style={{ background: "rgba(0,0,255,0.08)", border: "none", borderRadius: "50%", width: "32px", height: "32px", fontSize: "20px", color: "#0000FF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

// =====================================================
// CONFIRM DIALOG
// =====================================================
const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel, title = "Konfirmasi" }) => {
  if (!isOpen) return null;
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn confirm-btn-cancel" onClick={onCancel}>Batal</button>
          <button className="confirm-btn confirm-btn-confirm" onClick={onConfirm}>Ya, Lanjutkan</button>
        </div>
      </div>
    </div>
  );
};

const API_BASE_URL = "http://localhost:5000";

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("blob:")) return imagePath;
  const formattedPath = imagePath.replace(/\\/g, "/");
  return `${API_BASE_URL}${formattedPath.startsWith("/") ? "" : "/"}${formattedPath}`;
};

// =====================================================
// STAR RATING
// =====================================================
const StarRating = ({ rating, size = 20 }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span style={{ display: "flex", gap: "3px", alignItems: "center" }}>
      {[...Array(full)].map((_, i) => <FaStar key={`full-${i}`} style={{ color: "#f59e0b", fontSize: size }} />)}
      {half === 1 && <FaStarHalfAlt style={{ color: "#f59e0b", fontSize: size }} />}
      {[...Array(empty)].map((_, i) => <FaRegStar key={`empty-${i}`} style={{ color: "#d1d5db", fontSize: size }} />)}
    </span>
  );
};

// =====================================================
// DASHBOARD
// =====================================================
function Dashboard() {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [animal, setAnimal] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
  const [showAnimals, setShowAnimals] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState({ isOpen: false, message: "", title: "Konfirmasi", onConfirm: null });
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Selamat datang di PetCare Hub ZALTA", message: "Silakan pilih produk atau layanan yang kamu butuhkan.", read: false },
  ]);
  const [activeNav, setActiveNav] = useState("Beranda");
  const [showUserMenu, setShowUserMenu] = useState(false);

  // ========== STATE REVIEW ==========
  const [allReviews, setAllReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewPage, setReviewPage] = useState(0);
  const reviewsPerPage = 6;
  const [showReviewSection, setShowReviewSection] = useState(false);

  // ========== STATE SERVICE REVIEW ==========
  const [completedOrders, setCompletedOrders] = useState([]);
  const [showServiceReviewModal, setShowServiceReviewModal] = useState(false);
  const [selectedServiceOrder, setSelectedServiceOrder] = useState(null);
  const [serviceReviewForm, setServiceReviewForm] = useState({ rating: 5, comment: "" });

  // ========== STATE RIWAYAT PEROBATAN ==========
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loadingMedical, setLoadingMedical] = useState(false);
  const [showMedicalSection, setShowMedicalSection] = useState(false);

  // ========== STATE KONSULTASI DOKTER ==========
  const [consultations, setConsultations] = useState([]);
  const [loadingConsult, setLoadingConsult] = useState(false);
  const [medicalTab, setMedicalTab] = useState("consultations");

  const getUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(localStorage.getItem("currentUser"));
      return user;
    } catch { return null; }
  };
  const user = getUser();
  const userName = user?.nama || user?.name || "Pet Owner";
  const userEmail = user?.email || "user1@email.com";
  const userId = user?.id || user?.Id_user || user?.userId || null;

  const showToast = (message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

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

  const filteredProducts = products.filter((product) => {
    const name = (product.name || "").toLowerCase();
    const productCategory = (product.category || "").toLowerCase();
    const productAnimal = (product.animal || product.petType || product.category_pet || product.kategori_hewan || product.type || "").toLowerCase();
    const searchText = search.toLowerCase().trim();
    const selectedAnimal = animal.toLowerCase().trim();
    const selectedCategory = category.toLowerCase().trim();

    const searchMatch = !searchText || name.includes(searchText) || productCategory.includes(searchText) || productAnimal.includes(searchText);
    const categoryMatch = selectedCategory === "semua" || productCategory === selectedCategory;
    const animalMatch = selectedAnimal === "semua" || productAnimal === selectedAnimal || name.includes(selectedAnimal) || productCategory.includes(selectedAnimal);
    return searchMatch && categoryMatch && animalMatch;
  });

  const totalProducts = filteredProducts.length;
  const totalSlides = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    fetchProducts();
    loadCart();
    fetchReviews();
    fetchCompletedOrders();
    fetchMedicalRecords();
    fetchConsultations();
  }, []);

  useEffect(() => { setCurrentPage(0); }, [search, category, animal]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
      },
      { threshold: 0.15, rootMargin: "0px 0px -30px 0px" }
    );
    const elements = document.querySelectorAll(".scroll-animate");
    elements.forEach((el) => observer.observe(el));
    return () => { elements.forEach((el) => observer.unobserve(el)); observer.disconnect(); };
  }, [loading, currentProducts]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/products");
      const result = response.data;
      const productList = Array.isArray(result) ? result : result.data || [];
      setProducts(productList);
    } catch (err) {
      console.error("Gagal mengambil produk:", err);
      setError(err.response?.data?.message || "Tidak dapat mengambil data produk.");
    } finally { setLoading(false); }
  };

  const loadCart = () => {
    try { setCart(JSON.parse(localStorage.getItem("cart")) || []); } catch { setCart([]); }
  };

  const addToCart = (product) => {
    try {
      const productId = product.id || product._id;
      const oldCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existing = oldCart.find((item) => (item.id || item._id) === productId);
      let newCart;
      if (existing) {
        newCart = oldCart.map((item) => (item.id || item._id) === productId ? { ...item, quantity: (item.quantity || 1) + 1 } : item);
      } else {
        newCart = [...oldCart, { ...product, quantity: 1 }];
      }
      localStorage.setItem("cart", JSON.stringify(newCart));
      setCart(newCart);
      addNotification("Produk masuk keranjang", `${product.name} berhasil ditambahkan ke keranjang.`);
      showToast(`${product.name} berhasil masuk keranjang.`, "success");
    } catch (err) {
      console.error("Gagal menambahkan keranjang:", err);
      showToast("Gagal menambahkan produk ke keranjang.", "error");
    }
  };

  const addNotification = (title, message) => {
    setNotifications((prev) => [{ id: Date.now(), title, message, read: false }, ...prev]);
  };

  const unreadCount = notifications.filter((item) => !item.read).length;
  const markNotificationsRead = () => setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));

  const handleLogout = () => {
    showConfirm("Yakin ingin logout?", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("currentUser");
      navigate("/login", { replace: true });
    }, "Logout");
  };

  const handleCart = () => navigate("/cart");
  const goDoctor = () => navigate("/doctor");
  const goAdoption = () => navigate("/adoption");
  const goGrooming = () => navigate("/grooming");
  const goHotel = () => navigate("/hotel");

  const scrollToSection = (id, navName) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenu(false);
    if (navName) setActiveNav(navName);
  };

  const handleNavClick = (navName, id) => {
    setActiveNav(navName);
    if (id) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      if (id === "ulasan") setShowReviewSection(true);
      if (id === "riwayat-berobat") {
        setShowMedicalSection(true);
        fetchMedicalRecords();
        fetchConsultations();
      }
    } else {
      if (navName === "Dokter Hewan") goDoctor();
      else if (navName === "Adopsi") goAdoption();
      else if (navName === "Pet Hotel") goHotel();
    }
    setMobileMenu(false);
  };

  const formatPrice = (price) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(price) || 0);

  const formatDateID = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  const handleAnimalClick = (animalName) => {
    setAnimal(animalName);
    setCategory("Semua");
    setActiveNav("Produk");
    scrollToSection("produk", "Produk");
  };

  const handleOtherAnimal = (animalName) => {
    setAnimal(animalName);
    setCategory("Semua");
    setShowAnimals(false);
    setActiveNav("Produk");
    scrollToSection("produk", "Produk");
  };

  const goPrev = () => setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  const goNext = () => setCurrentPage((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
    document.body.style.overflow = "auto";
  };

  const handleAddToCartFromModal = (product) => { addToCart(product); closeProductModal(); };
  const handleOrderNow = (product) => { addToCart(product); navigate("/cart"); };
  const focusSearch = () => { if (searchInputRef.current) searchInputRef.current.focus(); };

  // ========== FETCH REVIEWS ==========
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await api.get("/reviews");
      const data = response.data;
      const reviews = Array.isArray(data) ? data : data.data || [];
      setAllReviews(reviews);
    } catch (err) {
      console.error("Gagal mengambil review:", err);
      setAllReviews([]);
    } finally { setLoadingReviews(false); }
  };

  // ========== FETCH COMPLETED ORDERS ==========
  const fetchCompletedOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await fetch("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const transactions = data.data || data;
        if (Array.isArray(transactions)) {
          const userOrders = transactions.filter((t) => {
            const isUser = t.userEmail === userEmail || t.userId === userId;
            const isService = ["grooming", "dokter", "adopsi", "hotel"].includes((t.type || "").toLowerCase());
            const isCompleted = (t.status || "").toLowerCase() === "selesai";
            return isUser && isService && isCompleted;
          });
          setCompletedOrders(userOrders);
        }
      }
    } catch (err) { console.error("Gagal mengambil pesanan selesai:", err); }
  };

  // ================================================================
  // FETCH MEDICAL RECORDS — DIPERBAIKI: FILTER FLEXIBLE (includes)
  // ================================================================
  const fetchMedicalRecords = async () => {
    setLoadingMedical(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/medical-records", {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });

      if (!response.ok) {
        console.error("❌ Response not OK:", response.status);
        setMedicalRecords([]);
        return;
      }

      const data = await response.json();
      const records = data.data || data || [];

      console.log("📥 Total medical records dari server:", records.length);
      console.log("👤 Login user:", userName, "|", userEmail);

      if (!Array.isArray(records)) {
        setMedicalRecords([]);
        return;
      }

      const loginName = (userName || "").toLowerCase().trim();
      const loginEmail = (userEmail || "").toLowerCase().trim();

      const myRecords = records.filter((r) => {
        const ownerName = (r.ownerName || r.owner_name || "").toLowerCase().trim();
        const ownerEmail = (r.ownerEmail || r.owner_email || "").toLowerCase().trim();

        // 1) Email cocok persis
        if (ownerEmail && ownerEmail === loginEmail) return true;

        // 2) Nama login MENGANDUNG nama owner (contoh: "vanya junita putri".includes("vanya"))
        if (ownerName && loginName && loginName.includes(ownerName)) return true;

        // 3) Nama owner MENGANDUNG nama login (jarang, tapi backup)
        if (ownerName && loginName && ownerName.includes(loginName)) return true;

        // 4) ownerName kosong → tampilkan (mode demo)
        if (!ownerName && !ownerEmail) return true;

        return false;
      });

      console.log("✅ Medical records milik user:", myRecords.length);
      setMedicalRecords(myRecords);
    } catch (err) {
      console.error("Gagal mengambil riwayat berobat:", err);
      setMedicalRecords([]);
    } finally {
      setLoadingMedical(false);
    }
  };

  // ================================================================
  // FETCH CONSULTATIONS (KONSULTASI DOKTER)
  // ================================================================
  const fetchConsultations = async () => {
    setLoadingConsult(true);
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:5000/api/consultations/user/${userId || 0}?email=${encodeURIComponent(userEmail)}`;
      const response = await fetch(url, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (response.ok) {
        const data = await response.json();
        const list = data.data || data || [];
        setConsultations(Array.isArray(list) ? list : []);
      } else {
        setConsultations([]);
      }
    } catch (err) {
      console.error("Gagal mengambil konsultasi:", err);
      setConsultations([]);
    } finally {
      setLoadingConsult(false);
    }
  };

  // ================================================================
  // WHATSAPP FOLLOW UP — LANJUT KONSULTASI
  // ================================================================
  const handleConsultWhatsApp = (c) => {
    if (!c.userPhone && !c.doctorPhone) {
      showToast("Nomor telepon dokter tidak tersedia.", "warning");
      return;
    }
    const rawPhone = c.doctorPhone || c.userPhone;
    let phone = "62" + rawPhone.replace(/\D/g, "").replace(/^0/, "");
    const msg = encodeURIComponent(
      `Halo drh. ${c.doctorName},\n\n` +
        `Saya ingin melanjutkan konsultasi.\n\n` +
        `Keluhan saya: ${c.complaint}\n\n` +
        `Balasan dokter: ${c.reply}\n\n` +
        `Terima kasih.`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  // ========== SERVICE REVIEW ==========
  const openServiceReviewModal = (order) => {
    setSelectedServiceOrder(order);
    setServiceReviewForm({ rating: 5, comment: "" });
    setShowServiceReviewModal(true);
  };

  const closeServiceReviewModal = () => {
    setShowServiceReviewModal(false);
    setSelectedServiceOrder(null);
  };

  const handleServiceReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedServiceOrder) return;
    if (serviceReviewForm.rating === 0) { showToast("Pilih minimal 1 bintang.", "warning"); return; }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        transactionId: selectedServiceOrder.id || selectedServiceOrder._id,
        userName: userName, userEmail: userEmail,
        rating: serviceReviewForm.rating,
        comment: serviceReviewForm.comment,
        type: "store",
      };
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        showToast("Review layanan berhasil dikirim! Terima kasih.", "success");
        closeServiceReviewModal();
        fetchReviews();
        fetchCompletedOrders();
      } else {
        showToast(result.message || "Gagal mengirim review.", "error");
      }
    } catch (err) {
      console.error("Error submit service review:", err);
      showToast("Gagal terhubung ke server.", "error");
    }
  };

  // ================================================================
  // RENDER ULASAN
  // ================================================================
  const renderReviews = () => {
    const totalReviewPages = Math.ceil(allReviews.length / reviewsPerPage);
    const reviewStart = reviewPage * reviewsPerPage;
    const paginatedReviews = allReviews.slice(reviewStart, reviewStart + reviewsPerPage);

    const getRatingEmoji = (rating) => {
      if (rating >= 4.5) return <FaRegLaugh style={{ color: "#22c55e", fontSize: "22px" }} />;
      if (rating >= 3.5) return <FaRegSmile style={{ color: "#22c55e", fontSize: "22px" }} />;
      if (rating >= 2.5) return <FaRegMeh style={{ color: "#f59e0b", fontSize: "22px" }} />;
      if (rating >= 1.5) return <FaRegFrown style={{ color: "#f59e0b", fontSize: "22px" }} />;
      return <FaRegAngry style={{ color: "#ef4444", fontSize: "22px" }} />;
    };

    const getAvatarColor = (name) => {
      const colors = ["#0000FF", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e"];
      return colors[name ? name.length % colors.length : 0];
    };

    return (
      <section className="dashboard-section reviews-section" id="ulasan"
        style={{ padding: "60px 20px", background: "linear-gradient(135deg, #f8faff 0%, #f0f7ff 100%)", borderTop: "1px solid #e2e8f0" }}>
        <div className="section-title centered" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "20px", maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }}>
          <div>
            <span style={{ color: "#0000FF", fontWeight: 300, letterSpacing: "1px" }}>PENDAPAT PELANGGAN</span>
            <h2 style={{ fontSize: "2rem", color: "#1e3a5f", margin: "4px 0" }}>Ulasan & Rating</h2>
            <p style={{ color: "#4a6a8a" }}>Lihat apa kata pelanggan lain tentang produk dan layanan kami.</p>
          </div>
          <button onClick={() => setShowReviewSection(!showReviewSection)}
            style={{ background: showReviewSection ? "#0000FF" : "transparent", border: showReviewSection ? "none" : "2px solid #0000FF", borderRadius: "40px", padding: "10px 24px", color: showReviewSection ? "#fff" : "#0000FF", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "15px", width: "fit-content" }}>
            {showReviewSection ? <FaChevronUp /> : <FaChevronDown />}
            {showReviewSection ? "Tutup Ulasan" : "Lihat Ulasan"}
          </button>
        </div>

        {showReviewSection && (
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
              <button onClick={() => setReviewPage(0)} style={{ padding: "8px 24px", borderRadius: "40px", border: "none", background: "#0000FF", color: "#fff", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", width: "fit-content" }}>
                <FaEye /> Semua ({allReviews.length})
              </button>
            </div>

            {loadingReviews ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "48px", color: "#0000FF" }} />
                <p style={{ marginTop: "16px", color: "#4a6a8a" }}>Memuat ulasan...</p>
              </div>
            ) : paginatedReviews.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "20px" }}>
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>📭</div>
                <h3 style={{ color: "#1e3a5f", marginBottom: "8px" }}>Belum ada ulasan</h3>
                <p style={{ color: "#6b7a8a" }}>Belum ada ulasan dari pelanggan. Jadilah yang pertama!</p>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", maxWidth: "1200px", margin: "0 auto" }}>
                  {paginatedReviews.map((review, index) => {
                    const id = review.id || review._id || index;
                    const rating = Number(review.rating) || 0;
                    const comment = review.comment || review.review || review.content || "-";
                    const name = review.userName || review.nama || "Anonim";
                    const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";
                    const type = review.type === "store" ? "Layanan" : "🛒 Produk";
                    const isMine = review.userEmail === userEmail || review.userName === userName;

                    return (
                      <div key={id} style={{ background: isMine ? "linear-gradient(135deg, #f0f7ff, #e8f0fe)" : "white", borderRadius: "16px", padding: "18px 20px", boxShadow: "0 4px 16px rgba(0,0,0,0.05)", border: isMine ? "2px solid #0000FF" : "1px solid #e9edf4", position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
                        {isMine && (
                          <div style={{ position: "absolute", top: "-8px", right: "12px", background: "#0000FF", color: "white", padding: "2px 14px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>
                            <FaCheck style={{ marginRight: "4px" }} /> Saya
                          </div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: getAvatarColor(name), color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "16px", flexShrink: 0 }}>
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <strong style={{ fontSize: "15px", color: "#1e3a5f", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</strong>
                            <div style={{ fontSize: "12px", color: "#6b7a8a", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                              <span style={{ background: "#f0f4fa", padding: "1px 8px", borderRadius: "10px" }}>{type}</span>
                              <span>•</span>
                              <span>{date}</span>
                            </div>
                          </div>
                          <div>{getRatingEmoji(rating)}</div>
                        </div>
                        <div style={{ margin: "6px 0 8px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <StarRating rating={rating} size={18} />
                          <span style={{ fontWeight: 700, color: "#1e3a5f", fontSize: "14px" }}>{rating.toFixed(1)}</span>
                        </div>
                        <p style={{ margin: "4px 0 0", color: "#334155", lineHeight: 1.6, fontSize: "14px", flex: 1 }}>
                          <FaQuoteLeft style={{ color: "#0000FF", opacity: 0.3, fontSize: "12px", marginRight: "4px" }} />
                          {comment}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {totalReviewPages > 1 && (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginTop: "30px", flexWrap: "wrap" }}>
                    <button onClick={() => setReviewPage(Math.max(0, reviewPage - 1))} disabled={reviewPage === 0}
                      style={{ padding: "8px 16px", borderRadius: "30px", border: "1px solid #d1d9e6", background: reviewPage === 0 ? "#f8fafc" : "white", color: reviewPage === 0 ? "#cbd5e1" : "#1e3a5f", cursor: reviewPage === 0 ? "default" : "pointer", display: "inline-flex", alignItems: "center", gap: "4px", width: "fit-content" }}>
                      <FaChevronLeft size={14} /> Sebelumnya
                    </button>
                    {Array.from({ length: totalReviewPages }).map((_, idx) => (
                      <button key={idx} onClick={() => setReviewPage(idx)}
                        style={{ minWidth: "36px", height: "36px", borderRadius: "50%", border: "none", background: idx === reviewPage ? "#0000FF" : "white", color: idx === reviewPage ? "#fff" : "#1e3a5f", fontWeight: idx === reviewPage ? 700 : 500, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        {idx + 1}
                      </button>
                    ))}
                    <button onClick={() => setReviewPage(Math.min(totalReviewPages - 1, reviewPage + 1))} disabled={reviewPage === totalReviewPages - 1}
                      style={{ padding: "8px 16px", borderRadius: "30px", border: "1px solid #d1d9e6", background: reviewPage === totalReviewPages - 1 ? "#f8fafc" : "white", color: reviewPage === totalReviewPages - 1 ? "#cbd5e1" : "#1e3a5f", cursor: reviewPage === totalReviewPages - 1 ? "default" : "pointer", display: "inline-flex", alignItems: "center", gap: "4px", width: "fit-content" }}>
                      Selanjutnya <FaChevronRight size={14} />
                    </button>
                  </div>
                )}
              </>
            )}

            {completedOrders.length > 0 && (
              <div style={{ marginTop: "50px", borderTop: "2px solid #e9edf4", paddingTop: "40px" }}>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <h3 style={{ color: "#1e3a5f", fontSize: "22px" }}>
                    <FaComment style={{ marginRight: "10px", color: "#0000FF" }} />
                    Beri Review untuk Layanan Selesai
                  </h3>
                  <p style={{ color: "#6b7a8a" }}>Anda memiliki layanan yang sudah selesai. Bagikan pengalaman Anda!</p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
                  {completedOrders.map((order) => {
                    const orderId = order.id || order._id;
                    const serviceName = order.itemName || order.name || "Layanan";
                    const type = (order.type || "").toLowerCase();
                    let typeLabel = "Layanan"; let icon = "📦";
                    if (type === "grooming") { typeLabel = "✂️ Grooming"; icon = "✂️"; }
                    else if (type === "dokter") { typeLabel = "🩺 Dokter"; icon = "🩺"; }
                    else if (type === "adopsi") { typeLabel = "🐾 Adopsi"; icon = "🐾"; }
                    else if (type === "hotel") { typeLabel = "🏨 Pet Hotel"; icon = "🏨"; }

                    return (
                      <div key={orderId} style={{ background: "white", padding: "18px 20px", borderRadius: "14px", border: "1px solid #e2e8f0", minWidth: "200px", flex: "1 0 auto", maxWidth: "280px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <div style={{ fontSize: "28px", marginBottom: "4px" }}>{icon}</div>
                        <div style={{ fontWeight: 600, color: "#1e3a5f", fontSize: "16px" }}>{serviceName}</div>
                        <div style={{ fontSize: "14px", color: "#6b7a8a" }}>{typeLabel}</div>
                        <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "10px" }}>
                          {order.date ? new Date(order.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : ""}
                        </div>
                        <button onClick={() => openServiceReviewModal(order)}
                          style={{ background: "#0000FF", color: "#fff", border: "none", borderRadius: "30px", padding: "8px 20px", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "auto", width: "fit-content" }}>
                          <FaStar /> Beri Review
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    );
  };

  // ================================================================
  // RENDER RIWAYAT PEROBATAN (DENGAN 2 TAB)
  // ================================================================
  const renderMedicalHistory = () => {
    return (
      <section
        className="dashboard-section medical-section"
        id="riwayat-berobat"
        style={{
          padding: "60px 20px",
          background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        {/* HEADER */}
        <div
          className="section-title centered"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "20px",
            maxWidth: "1200px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div>
            <span style={{ color: "#059669", fontWeight: 300, letterSpacing: "1px" }}>
              CATATAN KESEHATAN
            </span>
            <h2
              style={{
                fontSize: "2rem",
                color: "#1e3a5f",
                margin: "4px 0",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FaFileMedical style={{ color: "#059669" }} /> Riwayat Pengobatan
            </h2>
            <p style={{ color: "#4a6a8a" }}>
              Lihat catatan kesehatan, konsultasi, & balasan dokter Anda.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => {
                fetchMedicalRecords();
                fetchConsultations();
                showToast("Data di-refresh", "success");
              }}
              style={{
                background: "white",
                border: "2px solid #059669",
                borderRadius: "40px",
                padding: "10px 20px",
                color: "#059669",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                width: "fit-content",
              }}
            >
              <FaSpinner /> Refresh
            </button>
            <button
              onClick={() => {
                setShowMedicalSection(!showMedicalSection);
                if (!showMedicalSection) {
                  fetchMedicalRecords();
                  fetchConsultations();
                }
              }}
              style={{
                background: showMedicalSection ? "#059669" : "transparent",
                border: showMedicalSection ? "none" : "2px solid #059669",
                borderRadius: "40px",
                padding: "10px 24px",
                color: showMedicalSection ? "#fff" : "#059669",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "15px",
                width: "fit-content",
              }}
            >
              {showMedicalSection ? <FaChevronUp /> : <FaChevronDown />}
              {showMedicalSection ? "Tutup Riwayat" : "Lihat Riwayat"}
            </button>
          </div>
        </div>

        {showMedicalSection && (
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* TAB BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "24px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setMedicalTab("consultations")}
                style={{
                  padding: "12px 24px",
                  borderRadius: "40px",
                  border: medicalTab === "consultations" ? "none" : "2px solid #059669",
                  background: medicalTab === "consultations" ? "#059669" : "white",
                  color: medicalTab === "consultations" ? "white" : "#059669",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                }}
              >
                <FaStethoscope />
                Konsultasi Dokter ({consultations.length})
                {consultations.filter((c) => c.status === "menunggu").length > 0 && (
                  <span
                    style={{
                      background: "#ef4444",
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {consultations.filter((c) => c.status === "menunggu").length} baru
                  </span>
                )}
              </button>
              <button
                onClick={() => setMedicalTab("records")}
                style={{
                  padding: "12px 24px",
                  borderRadius: "40px",
                  border: medicalTab === "records" ? "none" : "2px solid #3b82f6",
                  background: medicalTab === "records" ? "#3b82f6" : "white",
                  color: medicalTab === "records" ? "white" : "#3b82f6",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                }}
              >
                <FaFileMedical />
                Riwayat Pemeriksaan ({medicalRecords.length})
              </button>
            </div>

            {/* TAB: KONSULTASI DOKTER */}
            {medicalTab === "consultations" && (
              <>
                {loadingConsult ? (
                  <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <FaSpinner
                      style={{
                        animation: "spin 1s linear infinite",
                        fontSize: "48px",
                        color: "#059669",
                      }}
                    />
                    <p style={{ marginTop: "16px", color: "#4a6a8a" }}>
                      Memuat konsultasi...
                    </p>
                  </div>
                ) : consultations.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "60px 20px",
                      background: "white",
                      borderRadius: "20px",
                    }}
                  >
                    <div style={{ fontSize: "64px", marginBottom: "16px" }}>💬</div>
                    <h3 style={{ color: "#1e3a5f", marginBottom: "8px" }}>
                      Belum ada konsultasi
                    </h3>
                    <p style={{ color: "#6b7a8a" }}>
                      Konsultasi dengan dokter hewan akan muncul di sini.
                    </p>
                    <button
                      onClick={goDoctor}
                      style={{
                        marginTop: "20px",
                        padding: "10px 24px",
                        background: "#059669",
                        color: "white",
                        border: "none",
                        borderRadius: "30px",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        width: "fit-content",
                      }}
                    >
                      <FaUserMd /> Konsultasi Sekarang
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                      gap: "20px",
                    }}
                  >
                    {consultations.map((c) => {
                      const id = c.id || c._id;
                      const statusColor =
                        c.status === "menunggu"
                          ? "#f59e0b"
                          : c.status === "dijawab"
                          ? "#10b981"
                          : "#3b82f6";
                      const statusLabel =
                        c.status === "menunggu"
                          ? "Menunggu Balasan"
                          : c.status === "dijawab"
                          ? "Sudah Dijawab"
                          : "Selesai";

                      return (
                        <div
                          key={id}
                          style={{
                            background: "white",
                            borderRadius: "16px",
                            padding: "20px",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                            border: "1px solid #d1fae5",
                            borderLeft: `4px solid ${statusColor}`,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {/* Header Dokter */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              marginBottom: "14px",
                              paddingBottom: "14px",
                              borderBottom: "1px dashed #d1fae5",
                            }}
                          >
                            <div
                              style={{
                                width: "46px",
                                height: "46px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #059669, #10b981)",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "20px",
                                flexShrink: 0,
                              }}
                            >
                              <FaUserMd />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <strong
                                style={{
                                  fontSize: "15px",
                                  color: "#1e3a5f",
                                  display: "block",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                drh. {c.doctorName || "Dokter Hewan"}
                              </strong>
                              <span style={{ fontSize: "12px", color: "#6b7a8a" }}>
                                {c.doctorSpecialization || "Dokter Hewan"}
                              </span>
                            </div>
                            <span
                              style={{
                                background: statusColor,
                                color: "white",
                                padding: "4px 10px",
                                borderRadius: "12px",
                                fontSize: "11px",
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {statusLabel}
                            </span>
                          </div>

                          {/* Keluhan */}
                          <div
                            style={{
                              background: "#fef3c7",
                              padding: "10px 12px",
                              borderRadius: "8px",
                              borderLeft: "3px solid #f59e0b",
                              marginBottom: "10px",
                            }}
                          >
                            <strong
                              style={{
                                color: "#92400e",
                                display: "block",
                                marginBottom: "4px",
                                fontSize: "11px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              💬 Keluhan Anda
                            </strong>
                            <span
                              style={{
                                color: "#78350f",
                                lineHeight: 1.5,
                                fontSize: "13px",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {c.complaint || "-"}
                            </span>
                          </div>

                          {/* Balasan Dokter */}
                          {c.reply ? (
                            <div
                              style={{
                                background: "#d1fae5",
                                padding: "10px 12px",
                                borderRadius: "8px",
                                borderLeft: "3px solid #10b981",
                                marginBottom: "10px",
                              }}
                            >
                              <strong
                                style={{
                                  color: "#065f46",
                                  display: "block",
                                  marginBottom: "4px",
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                🩺 Balasan Dokter
                              </strong>
                              <span
                                style={{
                                  color: "#064e3b",
                                  lineHeight: 1.5,
                                  fontSize: "13px",
                                  whiteSpace: "pre-wrap",
                                }}
                              >
                                {c.reply}
                              </span>
                            </div>
                          ) : (
                            <div
                              style={{
                                background: "#fef3c7",
                                padding: "10px 12px",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                fontSize: "13px",
                                color: "#92400e",
                                marginBottom: "10px",
                              }}
                            >
                              <FaClock />
                              <span>Menunggu balasan dokter...</span>
                            </div>
                          )}

                          {/* Meta */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              flexWrap: "wrap",
                              gap: "8px",
                              fontSize: "11px",
                              color: "#94a3b8",
                              paddingTop: "10px",
                              borderTop: "1px solid #f1f5f9",
                              marginTop: "auto",
                            }}
                          >
                            <span>
                              📅 Dikirim:{" "}
                              {c.createdAt
                                ? new Date(c.createdAt).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "-"}
                            </span>
                            {c.reply && (
                              <span>
                                ✅ Dibalas:{" "}
                                {c.updatedAt
                                  ? new Date(c.updatedAt).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "-"}
                              </span>
                            )}
                          </div>

                          {/* WhatsApp Button */}
                          {c.reply && (
                            <button
                              onClick={() => handleConsultWhatsApp(c)}
                              style={{
                                marginTop: "12px",
                                padding: "10px",
                                border: "none",
                                borderRadius: "10px",
                                background:
                                  "linear-gradient(135deg, #25d366, #128c7e)",
                                color: "white",
                                fontSize: "13px",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                              }}
                            >
                              <FaWhatsapp /> Lanjut via WhatsApp
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* TAB: RIWAYAT PEMERIKSAAN */}
            {medicalTab === "records" && (
              <>
                {loadingMedical ? (
                  <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <FaSpinner
                      style={{
                        animation: "spin 1s linear infinite",
                        fontSize: "48px",
                        color: "#3b82f6",
                      }}
                    />
                    <p style={{ marginTop: "16px", color: "#4a6a8a" }}>
                      Memuat riwayat pemeriksaan...
                    </p>
                  </div>
                ) : medicalRecords.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "60px 20px",
                      background: "white",
                      borderRadius: "20px",
                    }}
                  >
                    <div style={{ fontSize: "64px", marginBottom: "16px" }}>📋</div>
                    <h3 style={{ color: "#1e3a5f", marginBottom: "8px" }}>
                      Belum ada riwayat pemeriksaan
                    </h3>
                    <p style={{ color: "#6b7a8a" }}>
                      Riwayat pemeriksaan dari klinik akan muncul di sini.
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                      gap: "20px",
                    }}
                  >
                    {medicalRecords.map((record) => {
                      const id = record.id || record._id;
                      const petName = record.petName || record.pet_name || "-";
                      const petType = record.petType || record.pet_type || "-";
                      const doctorName = record.doctorName || record.doctor_name || "-";
                      const visitDate =
                        record.visitDate || record.visit_date || record.createdAt;
                      const complaint = record.complaint || "-";
                      const diagnosis = record.diagnosis || "-";
                      const treatment = record.treatment || "-";
                      const notes = record.notes || "";

                      return (
                        <div
                          key={id}
                          style={{
                            background: "white",
                            borderRadius: "16px",
                            padding: "20px",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                            border: "1px solid #dbeafe",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              marginBottom: "14px",
                              paddingBottom: "14px",
                              borderBottom: "1px dashed #dbeafe",
                            }}
                          >
                            <div
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                background:
                                  "linear-gradient(135deg, #3b82f6, #6366f1)",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "22px",
                                flexShrink: 0,
                              }}
                            >
                              <FaPaw />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <strong
                                style={{
                                  fontSize: "16px",
                                  color: "#1e3a5f",
                                  display: "block",
                                }}
                              >
                                {petName}
                              </strong>
                              <span style={{ fontSize: "13px", color: "#6b7a8a" }}>
                                {petType}
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#3b82f6",
                                fontWeight: 600,
                                background: "#dbeafe",
                                padding: "4px 10px",
                                borderRadius: "12px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <FaCalendarAlt style={{ marginRight: "4px" }} />
                              {formatDateID(visitDate)}
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "12px",
                              fontSize: "14px",
                              color: "#475569",
                            }}
                          >
                            <FaUserMd style={{ color: "#3b82f6" }} />
                            <span>
                              Dokter: <strong>{doctorName}</strong>
                            </span>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                              fontSize: "13px",
                              flex: 1,
                            }}
                          >
                            <div
                              style={{
                                background: "#fef3c7",
                                padding: "10px 12px",
                                borderRadius: "8px",
                                borderLeft: "3px solid #f59e0b",
                              }}
                            >
                              <strong
                                style={{
                                  color: "#92400e",
                                  display: "block",
                                  marginBottom: "2px",
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                }}
                              >
                                Keluhan
                              </strong>
                              <span style={{ color: "#78350f", lineHeight: 1.5 }}>
                                {complaint}
                              </span>
                            </div>
                            <div
                              style={{
                                background: "#dbeafe",
                                padding: "10px 12px",
                                borderRadius: "8px",
                                borderLeft: "3px solid #3b82f6",
                              }}
                            >
                              <strong
                                style={{
                                  color: "#1e40af",
                                  display: "block",
                                  marginBottom: "2px",
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                }}
                              >
                                Diagnosa
                              </strong>
                              <span style={{ color: "#1e3a8a", lineHeight: 1.5 }}>
                                {diagnosis}
                              </span>
                            </div>
                            {treatment !== "-" && (
                              <div
                                style={{
                                  background: "#dcfce7",
                                  padding: "10px 12px",
                                  borderRadius: "8px",
                                  borderLeft: "3px solid #10b981",
                                }}
                              >
                                <strong
                                  style={{
                                    color: "#065f46",
                                    display: "block",
                                    marginBottom: "2px",
                                    fontSize: "11px",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  Tindakan / Obat
                                </strong>
                                <span style={{ color: "#064e3b", lineHeight: 1.5 }}>
                                  {treatment}
                                </span>
                              </div>
                            )}
                            {notes && (
                              <div
                                style={{
                                  background: "#f1f5f9",
                                  padding: "10px 12px",
                                  borderRadius: "8px",
                                  borderLeft: "3px solid #64748b",
                                }}
                              >
                                <strong
                                  style={{
                                    color: "#334155",
                                    display: "block",
                                    marginBottom: "2px",
                                    fontSize: "11px",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  Catatan
                                </strong>
                                <span style={{ color: "#334155", lineHeight: 1.5 }}>
                                  {notes}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>
    );
  };

  // ================================================================
  // MODAL REVIEW LAYANAN
  // ================================================================
  const renderServiceReviewModal = () => {
    if (!showServiceReviewModal || !selectedServiceOrder) return null;

    return (
      <div className="modal-overlay" onClick={closeServiceReviewModal}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}
          style={{ background: "white", borderRadius: "20px", maxWidth: "500px", width: "100%", padding: "32px", position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
          <button onClick={closeServiceReviewModal}
            style={{ position: "absolute", top: "14px", right: "18px", background: "transparent", border: "none", fontSize: "24px", cursor: "pointer", color: "#94a3b8" }}>
            <FaTimes />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
            <div style={{ fontSize: "32px" }}>
              {selectedServiceOrder.type?.toLowerCase() === "grooming" ? "✂️"
                : selectedServiceOrder.type?.toLowerCase() === "dokter" ? "🩺"
                : selectedServiceOrder.type?.toLowerCase() === "adopsi" ? "🐾"
                : selectedServiceOrder.type?.toLowerCase() === "hotel" ? "🏨"
                : "⭐"}
            </div>
            <h3 style={{ color: "#1e3a5f", margin: 0 }}>Review Layanan</h3>
          </div>
          <p style={{ color: "#6b7a8a", marginBottom: "20px" }}>
            <strong>{selectedServiceOrder.itemName || selectedServiceOrder.name}</strong>
            <span style={{ marginLeft: "8px", background: "#f0f4fa", padding: "2px 12px", borderRadius: "12px", fontSize: "13px" }}>
              {selectedServiceOrder.type || "Layanan"}
            </span>
          </p>

          <form onSubmit={handleServiceReviewSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "8px", color: "#1e3a5f" }}>
                Rating Anda <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div style={{ display: "flex", gap: "10px", fontSize: "36px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} onClick={() => setServiceReviewForm({ ...serviceReviewForm, rating: star })}
                    style={{ cursor: "pointer", color: star <= serviceReviewForm.rating ? "#f59e0b" : "#d1d5db", transition: "0.15s" }}>
                    ★
                  </span>
                ))}
                <span style={{ fontSize: "18px", color: "#6b7a8a", marginLeft: "8px", fontWeight: 600 }}>
                  {serviceReviewForm.rating} / 5
                </span>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "8px", color: "#1e3a5f" }}>
                Komentar (Opsional)
              </label>
              <textarea value={serviceReviewForm.comment} onChange={(e) => setServiceReviewForm({ ...serviceReviewForm, comment: e.target.value })}
                rows="3" placeholder="Bagikan pengalaman Anda..."
                style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #d1d9e6", fontSize: "14px", resize: "vertical", fontFamily: "inherit" }} />
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button type="button" onClick={closeServiceReviewModal}
                style={{ padding: "10px 24px", borderRadius: "30px", border: "1px solid #d1d9e6", background: "white", cursor: "pointer", fontWeight: 600, color: "#4a6a8a", width: "fit-content" }}>
                Batal
              </button>
              <button type="submit"
                style={{ padding: "10px 28px", borderRadius: "30px", border: "none", background: "#0000FF", color: "#fff", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", width: "fit-content" }}>
                <FaCheck /> Kirim Review
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ============================================
  // STATIC DATA
  // ============================================
  const categories = [
    { name: "Semua", icon: <FaBox /> },
    { name: "Makanan", icon: <FaUtensils /> },
    { name: "Treats", icon: <FaBone /> },
    { name: "Mainan", icon: <FaPuzzlePiece /> },
    { name: "Kandang", icon: <FaHome /> },
    { name: "Vitamin", icon: <FaCapsules /> },
    { name: "Baju", icon: <FaTshirt /> },
  ];

  const animals = [
    { name: "Anjing", icon: <FaDog />, description: "Kebutuhan anjing" },
    { name: "Kucing", icon: <FaCat />, description: "Kebutuhan kucing" },
    { name: "Kelinci", icon: <FaPaw />, description: "Kebutuhan kelinci" },
  ];

  const otherAnimals = [
    { name: "Hamster", icon: <FaPaw /> },
    { name: "Ikan", icon: <FaFish /> },
    { name: "Burung", icon: <FaDove /> },
  ];

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="dashboard">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <ConfirmDialog isOpen={confirmState.isOpen} message={confirmState.message} title={confirmState.title} onConfirm={handleConfirm} onCancel={handleCancelConfirm} />
      {renderServiceReviewModal()}

      {/* ===== HEADER ===== */}
      <header className="dashboard-header" style={{ padding: "12px 0 8px", background: "#ffffff", borderBottom: "1px solid #eef2f6", position: "sticky", top: 0, zIndex: 100 }}>
        <div className="header-top" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px 20px", maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <div className="dashboard-logo" onClick={() => navigate("/dashboard")} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", flexShrink: 0 }}>
            <div className="dashboard-logo-icon" style={{ fontSize: "36px", color: "#0000FF", filter: "drop-shadow(0 2px 4px rgba(0,0,255,0.2))" }}>
              <FaPaw />
            </div>
            <div className="logo-text" style={{ lineHeight: 1.2 }}>
              <h2 style={{ margin: 0, fontSize: "20px", color: "#0b1a2e" }}>PetCare Hub</h2>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#0000FF", letterSpacing: "1px" }}>ZALTA</span>
            </div>
          </div>

          <div className="dashboard-search" style={{ flex: "1 1 320px", minWidth: "180px", display: "flex", alignItems: "center", background: "#f1f5f9", borderRadius: "40px", padding: "0 16px", border: "1px solid transparent" }}>
            <FaSearch onClick={focusSearch} style={{ color: "#6b7a8a", fontSize: "18px", cursor: "pointer", flexShrink: 0 }} />
            <input ref={searchInputRef} type="text" placeholder="Cari kebutuhan hewan..." value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, padding: "10px 12px", border: "none", background: "transparent", outline: "none", fontSize: "15px", color: "#1e293b", minWidth: "100px" }} />
            {search && (
              <button type="button" onClick={() => setSearch("")}
                style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "18px", cursor: "pointer", padding: "0 4px", flexShrink: 0 }}>
                <FaTimes />
              </button>
            )}
          </div>

          <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: "14px", flexShrink: 0 }}>
            <button type="button" className="hamburger-btn" onClick={() => setMobileMenu((prev) => !prev)} title="Menu"
              style={{ background: mobileMenu ? "#0000FF" : "transparent", color: mobileMenu ? "#ffffff" : "#1e3a5f", border: "none", fontSize: "22px", cursor: "pointer", padding: "8px", borderRadius: "10px", display: "none", alignItems: "center", justifyContent: "center" }}>
              {mobileMenu ? <FaTimes /> : <FaBars />}
            </button>

            <button type="button" onClick={handleCart} title="Keranjang"
              style={{ background: "transparent", border: "none", fontSize: "22px", color: "#1e3a5f", cursor: "pointer", position: "relative", padding: "4px" }}>
              <FaShoppingCart />
              {cart.length > 0 && (
                <span style={{ position: "absolute", top: "-4px", right: "-6px", background: "#ef4444", color: "white", borderRadius: "50%", width: "20px", height: "20px", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {cart.length}
                </span>
              )}
            </button>

            <div className="notification-wrapper" style={{ position: "relative" }}>
              <button type="button" onClick={() => { setShowNotifications((prev) => !prev); markNotificationsRead(); }} title="Notifikasi"
                style={{ background: "transparent", border: "none", fontSize: "22px", color: "#1e3a5f", cursor: "pointer", padding: "4px", position: "relative" }}>
                <FaBell />
                {unreadCount > 0 && (
                  <span style={{ position: "absolute", top: "-4px", right: "-6px", background: "#ef4444", color: "white", borderRadius: "50%", width: "20px", height: "20px", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "white", borderRadius: "16px", boxShadow: "0 12px 40px rgba(0,0,0,0.12)", minWidth: "280px", maxWidth: "360px", padding: "12px 0", zIndex: 999, border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "0 16px 8px", borderBottom: "1px solid #eef2f6" }}>
                    <strong style={{ color: "#1e3a5f" }}>Notifikasi</strong>
                    <button type="button" onClick={() => setShowNotifications(false)}
                      style={{ background: "transparent", border: "none", fontSize: "18px", cursor: "pointer", color: "#94a3b8" }}>
                      <FaTimes />
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <p style={{ padding: "16px", textAlign: "center", color: "#6b7a8a" }}>Belum ada notifikasi.</p>
                  ) : (
                    notifications.map((item) => (
                      <div key={item.id} style={{ padding: "10px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: "10px" }}>
                        <div style={{ color: "#0000FF", fontSize: "18px", flexShrink: 0 }}><FaCheckCircle /></div>
                        <div>
                          <strong style={{ fontSize: "14px", color: "#1e3a5f" }}>{item.title}</strong>
                          <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#4a6a8a" }}>{item.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="user-menu-wrapper" style={{ position: "relative" }}>
              <button type="button" onClick={() => setShowUserMenu((prev) => !prev)}
                style={{ fontWeight: 600, color: "#1e3a5f", background: "transparent", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "30px", fontSize: "15px" }}>
                <FaUserCircle size={22} />
                <span className="user-name-label">{userName}</span>
              </button>
              {showUserMenu && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "white", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: "150px", padding: "6px 0", zIndex: 999, border: "1px solid #e2e8f0" }}>
                  <button type="button" onClick={() => { setShowUserMenu(false); handleLogout(); }}
                    style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "10px 20px", background: "transparent", border: "none", width: "100%", textAlign: "left", color: "#dc2626", fontWeight: 500, cursor: "pointer", fontSize: "14px" }}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className={`dashboard-nav ${mobileMenu ? "mobile-open" : ""}`}>
          {[
            { name: "Beranda", id: "dashboard" },
            { name: "Produk", id: "produk" },
            { name: "Kategori", id: "kategori" },
            { name: "Layanan", id: "layanan" },
            { name: "Dokter Hewan", id: null },
            { name: "Adopsi", id: null },
            { name: "Pet Hotel", id: null },
            { name: "Riwayat Berobat", id: "riwayat-berobat" },
            { name: "Ulasan", id: "ulasan" },
            { name: "Kontak", id: "kontak" },
          ].map((item) => (
            <button key={item.name} type="button" onClick={() => handleNavClick(item.name, item.id)}
              className={`nav-btn ${activeNav === item.name ? "active" : ""}`}>
              {item.name}
            </button>
          ))}
        </nav>
      </header>

      {/* ===== HERO ===== */}
      <section className="dashboard-hero scroll-animate" id="dashboard"
        style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "linear-gradient(135deg, #f0f7ff 0%, #e6f0fa 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "5%", left: "3%", fontSize: "70px", color: "#FF6B6B", opacity: 0.25, transform: "rotate(-15deg)" }}><FaPaw /></div>
        <div style={{ position: "absolute", bottom: "8%", right: "2%", fontSize: "90px", color: "#4CAF50", opacity: 0.2, transform: "rotate(25deg)" }}><FaDog /></div>
        <div style={{ position: "absolute", top: "12%", right: "8%", fontSize: "60px", color: "#FF9800", opacity: 0.25, transform: "rotate(10deg)" }}><FaCat /></div>
        <div style={{ position: "absolute", bottom: "20%", left: "5%", fontSize: "50px", color: "#2196F3", opacity: 0.2, transform: "rotate(-5deg)" }}><FaBone /></div>
        <div style={{ position: "absolute", top: "45%", left: "12%", fontSize: "45px", color: "#E91E63", opacity: 0.2, transform: "rotate(45deg)" }}><FaHeart /></div>
        <div style={{ position: "absolute", bottom: "30%", right: "12%", fontSize: "50px", color: "#9C27B0", opacity: 0.2, transform: "rotate(-20deg)" }}><FaFish /></div>
        <div style={{ position: "absolute", top: "25%", left: "50%", fontSize: "40px", color: "#FF5722", opacity: 0.15, transform: "rotate(60deg)" }}><FaPuzzlePiece /></div>
        <div style={{ position: "absolute", bottom: "12%", left: "25%", fontSize: "45px", color: "#00BCD4", opacity: 0.2, transform: "rotate(-30deg)" }}><FaDove /></div>

        <div className="hero-content" style={{ textAlign: "center", maxWidth: "700px", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "14px", marginBottom: "8px" }}>
            <FaPaw style={{ color: "#0000FF", fontSize: "32px" }} />
            <FaHeart style={{ color: "#FF6B6B", fontSize: "32px" }} />
            <FaPaw style={{ color: "#0000FF", fontSize: "32px" }} />
          </div>
          <h1 style={{ fontSize: "2.8rem", lineHeight: 1.2, marginBottom: "12px" }}>
            Semua Kebutuhan Hewan<br />
            <span style={{ fontSize: "3rem", color: "#0000FF" }}>Ada di Sini!</span>
          </h1>
          <p style={{ fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto 24px", color: "#334155" }}>
            Temukan makanan, perlengkapan, kesehatan, perawatan, hingga layanan terbaik untuk hewan kesayanganmu.
          </p>
          <div className="hero-buttons" style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" onClick={() => scrollToSection("produk", "Produk")}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 20px", fontSize: "15px", fontWeight: 600, borderRadius: "40px", background: "#0000FF", color: "white", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,255,0.3)", width: "fit-content" }}>
              Belanja Sekarang
            </button>
            <button type="button" onClick={() => scrollToSection("layanan", "Layanan")}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 20px", fontSize: "15px", fontWeight: 600, borderRadius: "40px", background: "#0000FF", color: "white", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,255,0.3)", width: "fit-content" }}>
              Lihat Layanan
            </button>
          </div>
        </div>
      </section>

      {/* ===== ANIMAL ===== */}
      <section className="dashboard-section scroll-animate" style={{ paddingTop: "60px" }}>
        <div className="section-title">
          <span>UNTUK SAHABAT BULU</span>
          <h2>Pilih Berdasarkan Hewan</h2>
        </div>
        <div className="animal-grid">
          {animals.map((item) => (
            <button type="button" key={item.name}
              className={animal.toLowerCase() === item.name.toLowerCase() ? "animal-card active" : "animal-card"}
              onClick={() => handleAnimalClick(item.name)}>
              <div className="animal-icon">{item.icon}</div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <span className="animal-arrow"><FaArrowRight /></span>
            </button>
          ))}
          <button type="button" className="animal-card" onClick={() => setShowAnimals((prev) => !prev)}>
            <div className="animal-icon"><FaPaw /></div>
            <h3>Hewan Lain</h3>
            <p>Hamster, ikan, burung, dll.</p>
            <span className="animal-arrow"><FaArrowRight /></span>
          </button>
        </div>
        {showAnimals && (
          <div className="other-animal-menu">
            <h3>Pilih Hewan Lain</h3>
            <div>
              {otherAnimals.map((item) => (
                <button key={item.name} onClick={() => handleOtherAnimal(item.name)}>
                  {item.icon} <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ===== CATEGORY ===== */}
      <section className="category-section" id="kategori">
        <div className="dashboard-section scroll-animate">
          <div className="section-title">
            <span>JELAJAHI PRODUK</span>
            <h2>Kategori Produk</h2>
          </div>
          <div className="category-grid">
            {categories.map((item) => (
              <button type="button" key={item.name}
                className={category.toLowerCase() === item.name.toLowerCase() ? "category-card active" : "category-card"}
                onClick={() => { setCategory(item.name); setActiveNav("Kategori"); scrollToSection("produk", "Kategori"); }}>
                <div className="category-icon">{item.icon}</div>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS ===== */}
      <section className="dashboard-section products-section" id="produk">
        <div className="section-title product-title">
          <div>
            <span>PRODUK TERBAIK</span>
            <h2>Produk Pilihan</h2>
            {animal !== "Semua" && <p>Menampilkan kebutuhan <strong>{animal}</strong></p>}
          </div>
          <span className="total-products">{totalProducts} Produk</span>
        </div>

        {loading && (
          <div className="dashboard-status">
            <div className="spinner"></div>
            <p>Memuat produk dari server...</p>
          </div>
        )}
        {!loading && error && (
          <div className="dashboard-status">
            <div className="status-icon"><FaPaw /></div>
            <h3>Produk gagal dimuat</h3>
            <p>{error}</p>
            <button type="button" onClick={fetchProducts}>Coba Lagi</button>
          </div>
        )}
        {!loading && !error && totalProducts === 0 && (
          <div className="dashboard-status">
            <div className="status-icon"><FaBox /></div>
            <h3>Produk tidak ditemukan</h3>
            <p>Belum ada produk untuk pilihan tersebut.</p>
          </div>
        )}

        {!loading && !error && totalProducts > 0 && (
          <>
            <div className="product-slider-wrapper">
              <button type="button" className="slider-arrow slider-left" onClick={goPrev} disabled={totalSlides <= 1}>
                <FaChevronLeft />
              </button>
              <div className="product-grid">
                {currentProducts.map((product) => {
                  const productId = product.id || product._id;
                  return (
                    <div className="product-card scroll-animate" key={productId} onClick={() => openProductDetail(product)} style={{ cursor: "pointer" }}>
                      <div className="product-image">
                        {product.badge && <span className="product-badge">{product.badge}</span>}
                        {product.image ? (
                          <img src={getImageUrl(product.image)} alt={product.name}
                            onError={(e) => { e.target.style.display = "none"; if (e.target.nextSibling) e.target.nextSibling.style.display = "flex"; }} />
                        ) : null}
                        <div className="no-image" style={{ display: product.image ? "none" : "flex" }}><FaPaw /></div>
                        <button type="button" className="favorite" onClick={(e) => { e.stopPropagation(); showToast("Produk ditambahkan ke favorit.", "success"); }}>
                          <FaHeart />
                        </button>
                      </div>
                      <div className="product-info">
                        <span className="product-category">
                          {product.animal ? `${product.animal} • ` : ""}
                          {product.category || "Produk"}
                        </span>
                        <h3>{product.name}</h3>
                        <p className="product-description">{product.description || "Deskripsi produk tidak tersedia."}</p>
                        <div className="product-bottom">
                          <strong>{formatPrice(product.price)}</strong>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <button type="button" className="add-cart" onClick={(e) => { e.stopPropagation(); addToCart(product); }} title="Tambah ke Keranjang"
                              style={{ background: "transparent", border: "none", fontSize: "48px", color: "#0000FF", cursor: "pointer", display: "inline-flex", alignItems: "center", lineHeight: 1, width: "fit-content", height: "fit-content" }}>
                              <FaShoppingCart size="2rem" />
                            </button>
                            <button type="button" className="btn-order-now" onClick={(e) => { e.stopPropagation(); handleOrderNow(product); }}
                              style={{ backgroundColor: "#0000FF", color: "white", border: "none", borderRadius: "20px", padding: "6px 14px", fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", width: "fit-content" }}>
                              Pesan Sekarang
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button type="button" className="slider-arrow slider-right" onClick={goNext} disabled={totalSlides <= 1}>
                <FaChevronRight />
              </button>
            </div>
            {totalSlides > 1 && (
              <div className="slider-dots">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <span key={idx} className={idx === currentPage ? "dot active" : "dot"} onClick={() => setCurrentPage(idx)} />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* ===== SERVICES ===== */}
      <section className="services-section" id="layanan">
        <div className="section-title centered">
          <span>LEBIH DARI PET SHOP</span>
          <h2>Layanan Lengkap untuk Hewan</h2>
          <p>Dokter hewan, adopsi, grooming, dan pet hotel semua tersedia di Zalta.</p>
        </div>
        <div className="service-grid">
          {/* Dokter */}
          <button type="button" className="service-card scroll-animate" onClick={() => { setActiveNav("Dokter Hewan"); goDoctor(); }}>
            <div className="service-icon"><FaUserMd /></div>
            <h3>Dokter Hewan</h3>
            <p>Konsultasi kesehatan hewan bersama dokter profesional.</p>
            <span>Konsultasi</span>
          </button>
          {/* Adopsi */}
          <button type="button" className="service-card scroll-animate" onClick={() => { setActiveNav("Adopsi"); goAdoption(); }}>
            <div className="service-icon"><FaHeart /></div>
            <h3>Adopsi</h3>
            <p>Temukan sahabat baru yang membutuhkan rumah.</p>
            <span>Ajukan Adopsi</span>
          </button>
          {/* Grooming */}
          <button type="button" className="service-card scroll-animate" onClick={() => { setActiveNav("Layanan"); goGrooming(); }}>
            <div className="service-icon"><FaCut /></div>
            <h3>Grooming</h3>
            <p>Layanan perawatan dan grooming untuk hewan kesayangan.</p>
            <span>Pesan Grooming</span>
          </button>
          {/* Pet Hotel */}
          <button type="button" className="service-card scroll-animate" onClick={() => { setActiveNav("Pet Hotel"); goHotel(); }}>
            <div className="service-icon"><FaHotel /></div>
            <h3>Pet Hotel</h3>
            <p>Penitipan hewan dengan kamar nyaman, bersih, dan terawat.</p>
            <span>Pesan Kamar</span>
          </button>
        </div>
      </section>

      {/* ===== ULASAN ===== */}
      {renderReviews()}

      {/* ===== RIWAYAT PEROBATAN ===== */}
      {renderMedicalHistory()}

      {/* ===== KONTAK ===== */}
      <section className="contact-section" id="kontak">
        <div className="contact-container scroll-animate">
          <div className="contact-info">
            <span className="section-label">HUBUNGI KAMI</span>
            <h2>Konsultasi &amp; Kunjungi Kami</h2>
            <p>Kami siap membantu Anda dan hewan kesayangan. Datang langsung atau hubungi kami melalui kontak di bawah ini.</p>
            <div className="contact-list">
              <div className="contact-item">
                <div className="contact-icon"><FaMapMarkerAlt /></div>
                <div>
                  <strong>Alamat</strong>
                  <p>Jl. Raya PetCare No. 123, Kecamatan Zalta, Kota PetLovers 12345</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><FaPhone /></div>
                <div><strong>Telepon</strong><p>+62 812 3456 7890</p></div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><FaEnvelope /></div>
                <div><strong>Email</strong><p>info@petcarehubzalta.com</p></div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><FaClock /></div>
                <div><strong>Jam Operasional</strong><p>Senin – Sabtu: 08.00 – 20.00</p></div>
              </div>
            </div>
            <div className="social-media">
              <a href="#" target="_blank" rel="noreferrer"><FaInstagram /></a>
              <a href="#" target="_blank" rel="noreferrer"><FaFacebook /></a>
              <a href="#" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
            </div>
          </div>
          <div className="location-card">
            <div className="location-header">
              <div>
                <span>LOKASI KAMI</span>
                <h3>PetCare Hub ZALTA</h3>
              </div>
              <div className="location-marker"><FaMapMarkerAlt /></div>
            </div>
            <div className="map-wrapper">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15860.467348153556!2d106.8275637!3d-6.1783053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4e0b2dcd1c3%3A0x3d6f6c6a5f8c9f6b!2sJakarta%20Selatan!5e0!3m2!1sid!4v1675000000000!5m2!1sid"
                title="Lokasi PetCare Hub ZALTA" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <button type="button" className="map-button"
              onClick={() => window.open("https://maps.google.com/maps?q=Jakarta+Selatan", "_blank")}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "30px", border: "none", background: "#0000FF", color: "white", fontWeight: 600, cursor: "pointer", width: "fit-content", margin: "0 auto" }}>
              <FaMapMarkerAlt /> Buka di Google Maps
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="dashboard-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <FaPaw style={{ fontSize: "28px", color: "white" }} />
              <div>
                <span style={{ fontSize: "20px", fontWeight: 700, color: "white" }}>PetCare Hub</span>
                <br /><small style={{ color: "#8aa0b8" }}>ZALTA</small>
              </div>
            </div>
            <p>Solusi lengkap untuk kesehatan, perawatan, dan kebahagiaan hewan kesayangan Anda.</p>
            <div className="footer-social">
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaWhatsapp /></a>
            </div>
          </div>
          <div className="footer-column">
            <h3>Menu</h3>
            <button onClick={() => { setActiveNav("Beranda"); scrollToSection("dashboard", "Beranda"); }}>Beranda</button>
            <button onClick={() => { setActiveNav("Produk"); scrollToSection("produk", "Produk"); }}>Produk</button>
            <button onClick={() => { setActiveNav("Kategori"); scrollToSection("kategori", "Kategori"); }}>Kategori</button>
            <button onClick={() => { setActiveNav("Layanan"); scrollToSection("layanan", "Layanan"); }}>Layanan</button>
            <button onClick={() => { setActiveNav("Ulasan"); scrollToSection("ulasan", "Ulasan"); }}>Ulasan</button>
            <button onClick={() => { setActiveNav("Kontak"); scrollToSection("kontak", "Kontak"); }}>Kontak</button>
          </div>
          <div className="footer-column">
            <h3>Layanan</h3>
            <button onClick={() => { setActiveNav("Dokter Hewan"); goDoctor(); }}>Dokter Hewan</button>
            <button onClick={() => { setActiveNav("Adopsi"); goAdoption(); }}>Adopsi</button>
            <button onClick={() => { setActiveNav("Layanan"); goGrooming(); }}>Grooming</button>
            <button onClick={() => { setActiveNav("Pet Hotel"); goHotel(); }}>Pet Hotel</button>
          </div>
          <div className="footer-column">
            <h3>Kontak</h3>
            <p><FaMapMarkerAlt style={{ marginRight: "6px" }} /> Jl. Raya PetCare No.123</p>
            <p><FaPhone style={{ marginRight: "6px" }} /> +62 812 3456 7890</p>
            <p><FaEnvelope style={{ marginRight: "6px" }} /> info@petcarehubzalta.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 PetCare Hub ZALTA</span>
          <span>Semua Hak Dilindungi</span>
        </div>
      </footer>

      {/* ===== MODAL PRODUK ===== */}
      {showProductModal && selectedProduct && (
        <div className="product-modal-overlay" onClick={closeProductModal}>
          <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeProductModal}><FaTimes /></button>
            <div className="modal-product-image">
              {selectedProduct.image ? (
                <img src={getImageUrl(selectedProduct.image)} alt={selectedProduct.name}
                  style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "12px" }} />
              ) : (
                <div style={{ width: "100%", height: "250px", background: "#f0f4fa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "60px", color: "#a0b3c9", borderRadius: "12px" }}>
                  <FaPaw />
                </div>
              )}
            </div>
            <div className="modal-product-details">
              <span className="modal-product-category">
                {selectedProduct.animal ? `${selectedProduct.animal} • ` : ""}
                {selectedProduct.category || "Produk"}
              </span>
              <h2>{selectedProduct.name}</h2>
              <p className="modal-product-price">{formatPrice(selectedProduct.price)}</p>
              <div className="modal-product-description">
                <h4>Deskripsi Produk</h4>
                <p>{selectedProduct.description || "Tidak ada deskripsi untuk produk ini."}</p>
              </div>
              <div className="modal-product-actions">
                <button className="modal-add-cart" onClick={() => handleAddToCartFromModal(selectedProduct)}>
                  <FaShoppingCart /> Tambah ke Keranjang
                </button>
                <button className="modal-order-now" onClick={() => handleOrderNow(selectedProduct)}
                  style={{ background: "#0000FF", color: "white", padding: "10px 24px", borderRadius: "30px", border: "none", fontWeight: 600, cursor: "pointer" }}>
                  Pesan Sekarang
                </button>
                <button className="modal-close" onClick={closeProductModal}>Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;