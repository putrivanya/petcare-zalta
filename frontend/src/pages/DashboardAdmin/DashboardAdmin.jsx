import React, { useEffect, useMemo, useState } from "react";
import "./DashboardAdmin.css";

import {
  FaTachometerAlt, FaBox, FaStethoscope, FaCut, FaPaw, FaList, FaClipboardList,
  FaUsers, FaStar, FaSignOutAlt, FaBell, FaSearch, FaSyncAlt, FaPlus, FaEdit,
  FaTrash, FaTimes, FaCheck, FaBan, FaMoneyBillWave, FaImage, FaHeart,
  FaChevronDown, FaChevronRight, FaCalendarAlt, FaEnvelope, FaClock, FaTruck,
  FaUserCheck, FaEllipsisV, FaInfoCircle, FaExclamationTriangle, FaBars,
  FaBoxOpen, FaShippingFast, FaCheckDouble, FaMoneyCheckAlt, FaChartLine,
  FaHotel, FaMapMarkerAlt, FaPhone, FaPrint, FaFileMedical, FaFilter,
  FaCommentMedical, FaPaperPlane, FaReply,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api";
const SERVER_URL = API_URL.replace("/api", "");

const ENDPOINTS = {
  products: "/products",
  doctors: "/doctors",
  grooming: "/grooming",
  hotels: "/hotels",
  adoptions: "/adoptions",
  transactions: "/transactions",
  reviews: "/reviews",
  users: "/users",
  adoptionRequests: "/adoption-requests",
  medicalRecords: "/medical-records",
  consultations: "/consultations",
};

const FORM_CONFIG = {
  products: [
    { name: "name", label: "Nama Produk", type: "text", required: true },
    { name: "animal", label: "Jenis / Kategori Hewan", type: "select", options: ["Anjing", "Kucing", "Kelinci", "Burung", "ikan", "Hamster"], required: true },
    { name: "category", label: "Kategori Produk", type: "select", options: ["Makanan", "Treats", "Mainan", "Kandang", "Grooming", "Vitamin", "Baju"], required: true },
    { name: "price", label: "Harga", type: "number", required: true },
    { name: "stock", label: "Stok", type: "number" },
    { name: "badge", label: "Badge", type: "text" },
    { name: "description", label: "Detail Produk", type: "textarea" },
    { name: "image", label: "Gambar Produk", type: "file" },
  ],
  doctors: [
    { name: "name", label: "Nama Dokter", type: "text", required: true },
    { name: "specialization", label: "Spesialisasi", type: "text" },
    { name: "price", label: "Biaya Konsultasi", type: "number" },
    { name: "schedule", label: "Jadwal Praktik", type: "text" },
    { name: "phone", label: "No. Telepon", type: "text" },
    { name: "description", label: "Detail Dokter", type: "textarea" },
    { name: "image", label: "Foto Dokter", type: "file" },
  ],
  grooming: [
    { name: "name", label: "Nama Layanan", type: "text", required: true },
    { name: "animal", label: "Kategori Hewan", type: "select", options: ["Anjing", "Kucing", "Kelinci", "Burung", "Hewan Lainnya"] },
    { name: "duration", label: "Durasi", type: "text" },
    { name: "price", label: "Harga", type: "number" },
    { name: "description", label: "Detail Layanan", type: "textarea" },
    { name: "image", label: "Gambar Grooming", type: "file" },
  ],
  hotels: [
    { name: "name", label: "Nama Kamar / Layanan", type: "text", required: true },
    { name: "animal", label: "Kategori Hewan", type: "select", options: ["Anjing", "Kucing", "Kelinci", "Burung", "Hewan Lainnya"] },
    { name: "capacity", label: "Kapasitas", type: "text" },
    { name: "price", label: "Harga per Malam", type: "number" },
    { name: "facilities", label: "Fasilitas", type: "textarea" },
    { name: "description", label: "Detail Layanan", type: "textarea" },
    { name: "image", label: "Gambar Hotel", type: "file" },
  ],
  adoptions: [
    { name: "name", label: "Nama Hewan", type: "text", required: true },
    { name: "animal", label: "Jenis Hewan", type: "select", options: ["Anjing", "Kucing", "Kelinci", "Burung", "Hamster", "Ikan"] },
    { name: "breed", label: "Ras", type: "text" },
    { name: "age", label: "Umur", type: "text" },
    { name: "gender", label: "Jenis Kelamin", type: "select", options: ["Jantan", "Betina"] },
    { name: "status", label: "Status", type: "select", options: ["Tersedia", "Sudah Diadopsi"] },
    { name: "description", label: "Detail Hewan", type: "textarea" },
    { name: "image", label: "Foto Hewan", type: "file" },
  ],
  medicalRecords: [
    { name: "petName", label: "Nama Hewan", type: "text", required: true },
    { name: "petType", label: "Jenis Hewan", type: "select", options: ["Anjing", "Kucing", "Kelinci", "Burung", "Hamster", "Ikan", "Hewan Lainnya"], required: true },
    { name: "ownerName", label: "Nama Pemilik", type: "text", required: true },
    { name: "ownerPhone", label: "No. Telepon Pemilik", type: "text" },
    { name: "doctorName", label: "Dokter Pemeriksa", type: "text", required: true },
    { name: "visitDate", label: "Tanggal Berobat", type: "date", required: true },
    { name: "complaint", label: "Keluhan", type: "textarea", required: true },
    { name: "diagnosis", label: "Diagnosa", type: "textarea", required: true },
    { name: "treatment", label: "Tindakan / Pengobatan", type: "textarea" },
    { name: "notes", label: "Catatan Tambahan", type: "textarea" },
    { name: "image", label: "Foto/Dokumen Medis", type: "file" },
  ],
};

const getImageUrl = (image) => {
  if (!image || typeof image !== "string") return "https://via.placeholder.com/150?text=Tanpa+Gambar";
  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("blob:")) return image;
  if (image.startsWith("/")) return `${SERVER_URL}${image}`;
  return `${SERVER_URL}/${image}`;
};

const normalizeStatus = (status) => {
  if (status === undefined || status === null || status === "") return "pending";
  const value = String(status).trim().toLowerCase();
  if (["pending", "menunggu", "waiting", "menunggu konfirmasi"].includes(value)) return "pending";
  if (["approved", "dikonfirmasi", "disetujui", "confirm", "confirmed"].includes(value)) return "approved";
  if (["rejected", "ditolak", "reject"].includes(value)) return "rejected";
  if (["completed", "selesai", "complete"].includes(value)) return "selesai";
  if (["dikemas", "packed"].includes(value)) return "dikemas";
  if (["dikirim", "shipped"].includes(value)) return "dikirim";
  return value;
};

const normalizePaymentStatus = (status) => {
  if (!status) return "belum_bayar";
  const value = String(status).trim().toLowerCase();
  if (["paid", "dibayar", "lunas"].includes(value)) return "dibayar";
  if (["menunggu_verifikasi", "waiting_verification", "pending"].includes(value)) return "menunggu_verifikasi";
  if (["belum_bayar", "unpaid"].includes(value)) return "belum_bayar";
  return value;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(Number(price || 0));
};

const formatDateID = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};

const formatDateTimeID = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const COURIER_OPTIONS = [
  { value: "JNE", label: "JNE Reguler" },
  { value: "J&T", label: "J&T Express" },
  { value: "SICEPAT", label: "SiCepat Halu" },
];

const BULAN_OPTIONS = [
  { value: "all", label: "Semua Bulan" },
  { value: "0", label: "Januari" },
  { value: "1", label: "Februari" },
  { value: "2", label: "Maret" },
  { value: "3", label: "April" },
  { value: "4", label: "Mei" },
  { value: "5", label: "Juni" },
  { value: "6", label: "Juli" },
  { value: "7", label: "Agustus" },
  { value: "8", label: "September" },
  { value: "9", label: "Oktober" },
  { value: "10", label: "November" },
  { value: "11", label: "Desember" },
];

// =====================================================
// HELPER: Dapatkan daftar tahun dari data
// =====================================================
const getAvailableYears = (items, dateKeys = ["createdAt", "date", "visitDate"]) => {
  const years = new Set();
  const currentYear = new Date().getFullYear();

  (items || []).forEach((item) => {
    for (const key of dateKeys) {
      const val = item?.[key];
      if (val) {
        const d = new Date(val);
        if (!isNaN(d.getTime())) {
          years.add(d.getFullYear());
        }
      }
    }
  });

  years.add(currentYear);
  years.add(currentYear - 1);
  years.add(currentYear - 2);
  years.add(currentYear - 3);
  years.add(currentYear - 5);
  years.add(currentYear - 10);

  return Array.from(years).sort((a, b) => b - a);
};

// =====================================================
// HELPER: Filter by Date Range (untuk riwayat)
// =====================================================
const filterByDateRange = (items, filterType, filterYear, filterMonth, customStart, customEnd) => {
  return (items || []).filter((item) => {
    const rawDate = item.createdAt || item.date || item.visitDate || item.visit_date || item.bookingDate;
    if (!rawDate) return filterType === "all";

    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return filterType === "all";

    if (filterType === "all") return true;

    if (filterType === "year") {
      if (!filterYear || filterYear === "all") return true;
      return d.getFullYear() === Number(filterYear);
    }

    if (filterType === "month-year") {
      const yearMatch = !filterYear || filterYear === "all" || d.getFullYear() === Number(filterYear);
      const monthMatch = filterMonth === "all" || d.getMonth() === Number(filterMonth);
      return yearMatch && monthMatch;
    }

    if (filterType === "custom") {
      if (!customStart || !customEnd) return true;
      const start = new Date(customStart);
      start.setHours(0, 0, 0, 0);
      const end = new Date(customEnd);
      end.setHours(23, 59, 59, 999);
      return d >= start && d <= end;
    }

    return true;
  });
};

// =====================================================
// HELPER: Filter by Quick Range (untuk laporan)
// =====================================================
const filterByQuickRange = (items, range, customStart, customEnd) => {
  const now = new Date();
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  const endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

  let start = null;
  let end = null;

  switch (range) {
    case "today":
      start = startOfDay(now);
      end = endOfDay(now);
      break;
    case "thisWeek": {
      const day = now.getDay();
      const diff = day === 0 ? 6 : day - 1;
      const monday = new Date(now);
      monday.setDate(now.getDate() - diff);
      start = startOfDay(monday);
      end = endOfDay(now);
      break;
    }
    case "thisMonth": {
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      start = startOfDay(first);
      end = endOfDay(now);
      break;
    }
    case "thisYear": {
      const first = new Date(now.getFullYear(), 0, 1);
      start = startOfDay(first);
      end = endOfDay(now);
      break;
    }
    case "lastMonth": {
      const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const last = new Date(now.getFullYear(), now.getMonth(), 0);
      start = startOfDay(first);
      end = endOfDay(last);
      break;
    }
    case "lastYear": {
      const first = new Date(now.getFullYear() - 1, 0, 1);
      const last = new Date(now.getFullYear() - 1, 11, 31);
      start = startOfDay(first);
      end = endOfDay(last);
      break;
    }
    case "custom": {
      if (!customStart || !customEnd) return items || [];
      start = startOfDay(new Date(customStart));
      end = endOfDay(new Date(customEnd));
      break;
    }
    case "all":
    default:
      return items || [];
  }

  return (items || []).filter((item) => {
    const rawDate = item.createdAt || item.date || item.visitDate || item.visit_date || item.bookingDate;
    if (!rawDate) return false;
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return false;
    return d >= start && d <= end;
  });
};

// =====================================================
// TOAST CONTAINER
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
          <div className="toast-content"><div className="toast-message">{toast.message}</div></div>
          <button className="toast-close" onClick={() => onRemove(toast.id)}><FaTimes /></button>
          <div className="toast-progress" style={{ animationDuration: `${toast.duration}ms` }} />
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
        <div className="confirm-header">
          <div className="confirm-icon"><FaExclamationTriangle /></div>
          <h3 className="confirm-title">{title}</h3>
        </div>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn confirm-btn-cancel" onClick={onCancel}>Batal</button>
          <button className="confirm-btn confirm-btn-confirm" onClick={onConfirm}>Ya, Lanjutkan</button>
        </div>
      </div>
    </div>
  );
};

function DashboardAdmin() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [openMaster, setOpenMaster] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [products, setProducts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [grooming, setGrooming] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [consultations, setConsultations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [notification, setNotification] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState({ isOpen: false, message: "", title: "Konfirmasi", onConfirm: null });
  const [reviewTab, setReviewTab] = useState("product");

  const [showShippingModal, setShowShippingModal] = useState(false);
  const [shippingForm, setShippingForm] = useState({ id: null, courier: "", trackingNumber: "", customerCourier: "" });
  const [shippingTab, setShippingTab] = useState("perlu_dikirim");

  // ===== STATE KONSULTASI =====
  const [medicalTab, setMedicalTab] = useState("records");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [replyText, setReplyText] = useState("");

  // ===== STATE RIWAYAT FILTER =====
  const [riwayatFilterType, setRiwayatFilterType] = useState("all");
  const [riwayatFilterYear, setRiwayatFilterYear] = useState("all");
  const [riwayatFilterMonth, setRiwayatFilterMonth] = useState("all");
  const [riwayatCustomStart, setRiwayatCustomStart] = useState("");
  const [riwayatCustomEnd, setRiwayatCustomEnd] = useState("");

  // ===== STATE LAPORAN (QUICK FILTER) =====
  const [reportQuickFilter, setReportQuickFilter] = useState("thisMonth");
  const [reportCustomStart, setReportCustomStart] = useState("");
  const [reportCustomEnd, setReportCustomEnd] = useState("");
  const [reportTypeFilter, setReportTypeFilter] = useState("all");

  const adoptionLookups = useMemo(() => {
    const animalMap = {};
    const userMap = {};
    (adoptions || []).forEach((animal) => {
      const id = animal.id ?? animal._id;
      if (id !== undefined && id !== null) animalMap[String(id)] = animal;
    });
    (users || []).forEach((user) => {
      const id = user.id ?? user._id;
      if (id !== undefined && id !== null) userMap[String(id)] = user;
    });
    return { animalMap, userMap };
  }, [adoptions, users]);

  const showToast = (message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), duration);
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((toast) => toast.id !== id));

  const showConfirm = (message, onConfirm, title = "Konfirmasi") => {
    setConfirmState({ isOpen: true, message, title, onConfirm });
  };

  const handleConfirm = () => {
    if (confirmState.onConfirm) confirmState.onConfirm();
    setConfirmState({ isOpen: false, message: "", title: "Konfirmasi", onConfirm: null });
  };

  const handleCancelConfirm = () => setConfirmState({ isOpen: false, message: "", title: "Konfirmasi", onConfirm: null });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  };

  const getResponseData = async (response) => {
    try {
      const rawText = await response.text();
      if (!rawText) return [];
      let data;
      try { data = JSON.parse(rawText); } catch { return []; }
      if (Array.isArray(data)) return data;
      const commonKeys = ["data", "products", "doctors", "grooming", "hotels", "adoptions", "users", "transactions", "bookings", "reviews", "adoptionRequests", "adoption_requests", "medicalRecords", "consultations", "results", "items", "list", "records"];
      for (const key of commonKeys) {
        if (Array.isArray(data?.[key])) return data[key];
      }
      const findArray = (obj) => {
        if (Array.isArray(obj)) return obj;
        if (obj && typeof obj === "object") {
          for (const key of Object.keys(obj)) {
            const result = findArray(obj[key]);
            if (result) return result;
          }
        }
        return null;
      };
      return findArray(data) || [];
    } catch (error) {
      console.error("RESPONSE PARSER ERROR:", error);
      return [];
    }
  };

  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, { headers: { ...getAuthHeaders() } });
      if (!response.ok) throw new Error(`GET ${endpoint} gagal (${response.status})`);
      return await getResponseData(response);
    } catch (error) {
      console.error("FETCH ERROR:", endpoint, error);
      return [];
    }
  };

  const fetchProducts = async () => { const data = await fetchData(ENDPOINTS.products); setProducts(data); };
  const fetchDoctors = async () => { const data = await fetchData(ENDPOINTS.doctors); setDoctors(data); };
  const fetchGrooming = async () => { const data = await fetchData(ENDPOINTS.grooming); setGrooming(data); };
  const fetchHotels = async () => { const data = await fetchData(ENDPOINTS.hotels); setHotels(data); };
  const fetchAdoptions = async () => { const data = await fetchData(ENDPOINTS.adoptions); setAdoptions(data); };
  const fetchReviews = async () => { const data = await fetchData(ENDPOINTS.reviews); setReviews(data); };
  const fetchUsers = async () => { const data = await fetchData(ENDPOINTS.users); setUsers(data); return data; };

  const fetchMedicalRecords = async () => {
    try {
      const data = await fetchData(ENDPOINTS.medicalRecords);
      setMedicalRecords(data);
      return data;
    } catch {
      setMedicalRecords([]);
      return [];
    }
  };

  const fetchConsultations = async () => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.consultations}`, { headers: { ...getAuthHeaders() } });
      if (!response.ok) { setConsultations([]); return []; }
      const data = await getResponseData(response);
      setConsultations(data);
      return data;
    } catch (error) {
      console.error("CONSULTATION ERROR:", error);
      setConsultations([]);
      return [];
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.transactions}`, { headers: { ...getAuthHeaders() } });
      let data = [];
      if (response.ok) data = await getResponseData(response);
      setTransactions(data);
      return data;
    } catch (error) {
      console.error("TRANSACTION ERROR:", error);
      setTransactions([]);
      return [];
    }
  };

  const fetchAdoptionRequests = async () => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.adoptionRequests}`, { headers: { ...getAuthHeaders() } });
      if (!response.ok) { setAdoptionRequests([]); return []; }
      const data = await getResponseData(response);
      setAdoptionRequests(data);
      return data;
    } catch (error) {
      console.error("ADOPTION REQUEST ERROR:", error);
      setAdoptionRequests([]);
      return [];
    }
  };

  const calculateNotification = (transactionData = transactions, adoptionData = adoptionRequests, consultData = consultations) => {
    const waitingBooking = transactionData.filter((item) => normalizeStatus(item.status) === "pending").length;
    const waitingPayment = transactionData.filter((item) => normalizePaymentStatus(item.paymentStatus || item.payment_status) === "menunggu_verifikasi").length;
    const pendingAdoption = adoptionData.filter((item) => normalizeStatus(item.status) === "pending").length;
    const pendingConsult = consultData.filter((item) => item.status === "menunggu").length;
    setNotification(waitingBooking + waitingPayment + pendingAdoption + pendingConsult);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const results = await Promise.all([
        fetchProducts(), fetchDoctors(), fetchGrooming(), fetchHotels(), fetchAdoptions(),
        fetchTransactions(), fetchReviews(), fetchUsers(), fetchAdoptionRequests(),
        fetchMedicalRecords(), fetchConsultations(),
      ]);
      calculateNotification(results[5] || [], results[8] || [], results[10] || []);
    } catch (error) {
      console.error("LOAD DATA ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllDataSilently = async () => {
    try {
      const results = await Promise.all([
        fetchProducts(), fetchDoctors(), fetchGrooming(), fetchHotels(), fetchAdoptions(),
        fetchTransactions(), fetchReviews(), fetchUsers(), fetchAdoptionRequests(),
        fetchMedicalRecords(), fetchConsultations(),
      ]);
      calculateNotification(results[5] || [], results[8] || [], results[10] || []);
    } catch (error) {
      console.error("BACKGROUND LOAD ERROR:", error);
    }
  };

  useEffect(() => {
    loadAllData();
    const interval = setInterval(() => loadAllDataSilently(), 10000);
    return () => clearInterval(interval);
  }, []);

  const currentData = useMemo(() => {
    switch (activeMenu) {
      case "products": return products;
      case "doctors": return doctors;
      case "grooming": return grooming;
      case "hotels": return hotels;
      case "adoptions": return adoptions;
      case "users": return users;
      case "reviews": return reviews;
      case "medicalRecords": return medicalRecords;
      default: return [];
    }
  }, [activeMenu, products, doctors, grooming, hotels, adoptions, users, reviews, medicalRecords]);

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return currentData;
    return currentData.filter((item) => JSON.stringify(item).toLowerCase().includes(keyword));
  }, [currentData, search]);

  const getTitle = () => {
    switch (activeMenu) {
      case "products": return "Produk";
      case "doctors": return "Dokter Hewan";
      case "grooming": return "Grooming";
      case "hotels": return "Pet Hotel";
      case "adoptions": return "Adopsi";
      case "users": return "Users";
      case "reviews": return "Review";
      case "adoptionRequests": return "Pengajuan Adopsi";
      case "transactions": return "Pesanan";
      case "bookings": return "Booking";
      case "shipping": return "Kelola Pengiriman";
      case "reports": return "Laporan";
      case "medicalRecords": return "Riwayat Berobat & Konsultasi";
      default: return "";
    }
  };

  const getSubtitle = () => {
    const t = getTitle();
    if (!t) return "";
    return `Kelola data ${t.toLowerCase()}.`;
  };

  const openAddModal = () => {
    if (["adoptionRequests", "transactions", "bookings", "users", "reviews", "reports", "shipping"].includes(activeMenu)) return;
    setEditingId(null);
    const config = FORM_CONFIG[activeMenu] || [];
    const initial = {};
    config.forEach((field) => {
      if (["category", "type"].includes(field.name)) initial[field.name] = field.options?.[0] || "";
      else if (field.name === "animal") initial[field.name] = "Anjing";
      else if (field.options) initial[field.name] = field.options[0] || "";
      else if (field.type === "file") initial[field.name] = null;
      else initial[field.name] = "";
    });
    initial.imagePreview = "";
    setForm(initial);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    if (["adoptionRequests", "transactions", "bookings", "users", "reviews", "reports", "shipping"].includes(activeMenu)) return;
    const id = item.id ?? item._id;
    setEditingId(id);
    setForm({ ...item, imagePreview: item.image ? getImageUrl(item.image) : "" });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      const file = files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) { showToast("File harus berupa gambar.", "warning"); e.target.value = ""; return; }
      if (file.size > 5 * 1024 * 1024) { showToast("Ukuran gambar maksimal 5 MB.", "warning"); e.target.value = ""; return; }
      const preview = URL.createObjectURL(file);
      setForm((prev) => {
        if (prev.imagePreview && prev.imagePreview.startsWith("blob:")) URL.revokeObjectURL(prev.imagePreview);
        return { ...prev, [name]: file, imagePreview: preview };
      });
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = ENDPOINTS[activeMenu];
      if (!endpoint) { showToast("Menu ini tidak mendukung CRUD.", "warning"); return; }
      const url = editingId ? `${API_URL}${endpoint}/${editingId}` : `${API_URL}${endpoint}`;
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (["imagePreview", "id", "_id", "createdAt", "updatedAt"].includes(key)) return;
        const value = form[key];
        if (value instanceof File) { formData.append(key, value); return; }
        if (key === "image" && typeof value === "string") return;
        if (value !== undefined && value !== null && value !== "") formData.append(key, value);
      });

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { ...getAuthHeaders() },
        body: formData,
      });

      const contentType = response.headers.get("content-type") || "";
      let data = {};
      if (contentType.includes("application/json")) data = await response.json();
      else data = { message: await response.text() };

      if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`);

      showToast(editingId ? "Data berhasil diperbarui!" : "Data berhasil ditambahkan!", "success");
      if (form.imagePreview?.startsWith("blob:")) URL.revokeObjectURL(form.imagePreview);
      setShowModal(false);
      setEditingId(null);
      setForm({});
      await loadAllData();
    } catch (error) {
      console.error("SUBMIT ERROR:", error);
      showToast(error.message || "Gagal menyimpan data.", "error");
    }
  };

  const handleDelete = (id) => {
    showConfirm("Yakin ingin menghapus data ini?", async () => {
      try {
        const endpoint = ENDPOINTS[activeMenu];
        const response = await fetch(`${API_URL}${endpoint}/${id}`, {
          method: "DELETE",
          headers: { ...getAuthHeaders() },
        });
        const contentType = response.headers.get("content-type") || "";
        let data = {};
        if (contentType.includes("application/json")) data = await response.json();
        if (!response.ok) throw new Error(data.message || "Gagal menghapus data.");
        showToast("Data berhasil dihapus!", "success");
        await loadAllData();
      } catch (error) {
        console.error("DELETE ERROR:", error);
        showToast(error.message || "Gagal menghapus data.", "error");
      }
    }, "Hapus Data");
  };

  const updateAdoptionRequestStatus = (id, status) => {
    const actionText = status === "approved" ? "menyetujui" : "menolak";
    showConfirm(`Yakin ingin ${actionText} pengajuan adopsi ini?`, async () => {
      try {
        const response = await fetch(`${API_URL}${ENDPOINTS.adoptionRequests}/${id}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify({ status }),
        });
        const contentType = response.headers.get("content-type") || "";
        let data = {};
        if (contentType.includes("application/json")) data = await response.json();
        if (!response.ok) throw new Error(data.message || `Gagal update status (${response.status})`);
        showToast(status === "approved" ? "Pengajuan berhasil disetujui." : "Pengajuan berhasil ditolak.", "success");
        await fetchAdoptionRequests();
        await fetchTransactions();
        calculateNotification(transactions, adoptionRequests, consultations);
      } catch (error) {
        console.error("UPDATE ADOPTION STATUS:", error);
        showToast(error.message || "Gagal mengubah status.", "error");
      }
    }, "Konfirmasi Status");
  };

  const deleteAdoptionRequest = (id) => {
    showConfirm("Yakin ingin menghapus pengajuan adopsi ini?", async () => {
      try {
        const response = await fetch(`${API_URL}${ENDPOINTS.adoptionRequests}/${id}`, {
          method: "DELETE",
          headers: { ...getAuthHeaders() },
        });
        const contentType = response.headers.get("content-type") || "";
        let data = {};
        if (contentType.includes("application/json")) data = await response.json();
        if (!response.ok) throw new Error(data.message || "Gagal menghapus pengajuan.");
        showToast("Pengajuan berhasil dihapus.", "success");
        await fetchAdoptionRequests();
      } catch (error) {
        console.error(error);
        showToast(error.message || "Gagal menghapus pengajuan.", "error");
      }
    }, "Hapus Pengajuan");
  };

  const updateTransactionStatus = (id, status) => {
    showConfirm(`Yakin mengubah status menjadi ${status}?`, async () => {
      try {
        const response = await fetch(`${API_URL}/transactions/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify({ status }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Gagal update transaksi.");
        await fetchTransactions();
        showToast("Status transaksi berhasil diperbarui.", "success");
      } catch (error) {
        console.error(error);
        showToast(error.message || "Gagal update transaksi.", "error");
      }
    }, "Update Status");
  };

  const updatePaymentStatus = (id, paymentStatus) => {
    showConfirm(`Yakin mengubah status pembayaran menjadi ${paymentStatus}?`, async () => {
      try {
        const response = await fetch(`${API_URL}/transactions/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify({ paymentStatus }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Gagal update pembayaran.");
        await fetchTransactions();
        showToast("Status pembayaran berhasil diperbarui.", "success");
      } catch (error) {
        console.error(error);
        showToast(error.message || "Gagal update pembayaran.", "error");
      }
    }, "Update Pembayaran");
  };

  const deleteTransaction = (id) => {
    showConfirm("Yakin ingin menghapus pesanan ini?", async () => {
      try {
        const response = await fetch(`${API_URL}/transactions/${id}`, {
          method: "DELETE",
          headers: { ...getAuthHeaders() },
        });
        if (!response.ok) throw new Error("Gagal menghapus pesanan.");
        await fetchTransactions();
        showToast("Pesanan berhasil dihapus.", "success");
      } catch (error) {
        showToast(error.message, "error");
      }
    }, "Hapus Pesanan");
  };

  const approveBooking = (id) => {
    showConfirm("Setujui booking ini?", async () => {
      try {
        const response = await fetch(`${API_URL}/transactions/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify({ status: "dikemas" }),
        });
        if (!response.ok) throw new Error(`Gagal menyetujui (${response.status})`);
        await fetchTransactions();
        showToast("Booking berhasil disetujui.", "success");
      } catch (error) {
        showToast(error.message, "error");
      }
    }, "Setujui Booking");
  };

  const openShippingModal = (item) => {
    const id = item.id ?? item._id;
    const customerCourier = (item.courier || "").toUpperCase();
    const matchedCourier = COURIER_OPTIONS.find(
      (c) => c.value === customerCourier || c.label.toUpperCase().includes(customerCourier)
    );
    setShippingForm({
      id,
      courier: item.courier || (matchedCourier ? matchedCourier.value : ""),
      trackingNumber: item.trackingNumber || item.no_resi || "",
      customerCourier: item.courier || "",
    });
    setShowShippingModal(true);
  };

  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    if (!shippingForm.courier || !shippingForm.trackingNumber) {
      showToast("Kurir dan nomor resi wajib diisi.", "warning");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/transactions/${shippingForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          status: "dikirim",
          courier: shippingForm.courier,
          trackingNumber: shippingForm.trackingNumber,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal mengirim pesanan.");
      await fetchTransactions();
      showToast("Pesanan berhasil dikirim dan resi disimpan.", "success");
      setShowShippingModal(false);
      setShippingForm({ id: null, courier: "", trackingNumber: "", customerCourier: "" });
    } catch (error) {
      console.error(error);
      showToast(error.message || "Gagal mengirim pesanan.", "error");
    }
  };

  // ============================================================
  // KONSULTASI
  // ============================================================
  const openReplyModal = (consultation) => {
    setSelectedConsultation(consultation);
    setReplyText(consultation.reply || "");
    setShowReplyModal(true);
  };

  const submitConsultationReply = async () => {
    if (!selectedConsultation || !replyText.trim()) {
      showToast("Balasan wajib diisi.", "warning");
      return;
    }

    try {
      const id = selectedConsultation.id ?? selectedConsultation._id;
      const response = await fetch(
        `${API_URL}${ENDPOINTS.consultations}/${id}/reply`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ reply: replyText }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal membalas.");

      showToast("Balasan berhasil dikirim ke pelanggan.", "success");
      setShowReplyModal(false);
      setSelectedConsultation(null);
      setReplyText("");
      await fetchConsultations();
    } catch (error) {
      console.error("REPLY ERROR:", error);
      showToast(error.message || "Gagal membalas.", "error");
    }
  };

  const markConsultationDone = async (id) => {
    try {
      const resp = await fetch(`${API_URL}${ENDPOINTS.consultations}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ status: "selesai" }),
      });
      if (!resp.ok) throw new Error("Gagal update status konsultasi.");
      showToast("Konsultasi ditandai selesai.", "success");
      await fetchConsultations();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleLogout = () => {
    showConfirm("Yakin ingin logout?", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }, "Logout");
  };

  // ============================================================
  // RENDER DASHBOARD
  // ============================================================
  const renderDashboard = () => {
    const waitingBooking = transactions.filter((item) => normalizeStatus(item.status) === "pending").length;
    const waitingPayment = transactions.filter((item) => normalizePaymentStatus(item.paymentStatus || item.payment_status) === "menunggu_verifikasi").length;
    const pendingAdoption = adoptionRequests.filter((item) => normalizeStatus(item.status) === "pending").length;
    const pendingConsult = consultations.filter((item) => item.status === "menunggu").length;

    return (
      <>
        <div className="page-heading">
          <span className="eyebrow">PETCARE HUB ZALTA</span>
          <div className="heading-row">
            <h1>Dashboard Admin</h1>
            <p>Kelola seluruh data PetCare Hub dari satu tempat.</p>
          </div>
        </div>
        <div className="stats-grid">
          <StatCard icon={<FaBox />} title="Produk" value={products.length} />
          <StatCard icon={<FaStethoscope />} title="Dokter" value={doctors.length} />
          <StatCard icon={<FaCut />} title="Grooming" value={grooming.length} />
          <StatCard icon={<FaHotel />} title="Pet Hotel" value={hotels.length} />
          <StatCard icon={<FaHeart />} title="Adopsi" value={adoptions.length} />
          <StatCard icon={<FaUsers />} title="Users" value={users.length} />
          <StatCard icon={<FaClipboardList />} title="Pesanan" value={transactions.length} />
          <StatCard icon={<FaStar />} title="Review" value={reviews.length} />
          <StatCard icon={<FaFileMedical />} title="Riwayat Berobat" value={medicalRecords.length} />
          <StatCard icon={<FaCommentMedical />} title="Konsultasi" value={consultations.length} />
          <StatCard icon={<FaUserCheck />} title="Pengajuan Adopsi" value={adoptionRequests.length} />
        </div>
        <div className="dashboard-bottom">
          <div className="welcome-card">
            <div>
              <span className="eyebrow">ADMIN PANEL</span>
              <h2>Kelola PetCare Hub dengan mudah.</h2>
              <p>Produk, dokter, grooming, hotel, adopsi, users, pesanan, booking, riwayat berobat, konsultasi, review, dan pengajuan adopsi.</p>
              <button onClick={() => setActiveMenu("products")}>Kelola Produk</button>
            </div>
            <div className="welcome-illustration"><FaPaw /></div>
          </div>
          <div className="waiting-card">
            <FaBell />
            <div>
              <span>Menunggu tindakan</span>
              <strong>{notification}</strong>
              <p>{waitingBooking} pesanan, {waitingPayment} pembayaran, {pendingAdoption} adopsi, {pendingConsult} konsultasi.</p>
            </div>
          </div>
        </div>
      </>
    );
  };

  // ============================================================
  // RENDER CRUD
  // ============================================================
  const renderCrud = () => {
    const isReadOnly = ["users", "reviews", "adoptionRequests", "transactions", "bookings", "reports", "shipping"].includes(activeMenu);
    const canAdd = !isReadOnly;

    return (
      <>
        <div className="page-heading">
          <span className="eyebrow">MASTER DATA</span>
          <div className="heading-row"><h1>{getTitle()}</h1><p>{getSubtitle()}</p></div>
        </div>
        <div className="toolbar">
          <div className="search-box">
            <FaSearch />
            <input type="text" placeholder={`Cari ${getTitle()}...`} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="toolbar-actions">
            <button className="refresh-btn" onClick={loadAllData}><FaSyncAlt /> Refresh</button>
            {canAdd && <button className="primary-btn" onClick={openAddModal}><FaPlus /> Tambah {getTitle()}</button>}
          </div>
        </div>
        {activeMenu === "users" ? renderUsers() :
         activeMenu === "reviews" ? renderReviews() :
         activeMenu === "adoptionRequests" ? renderAdoptionRequests() :
         activeMenu === "medicalRecords" ? renderMedicalRecords() :
         renderDataTable(filteredData)}
      </>
    );
  };

  const renderDataTable = (data) => (
    <div className="data-table-card">
      {loading && data.length === 0 ? (
        <div className="empty-state"><FaSyncAlt /><p>Memuat data...</p></div>
      ) : data.length === 0 ? (
        <div className="empty-state"><FaPaw /><h3>Belum ada data</h3><p>Silakan tambahkan data terlebih dahulu.</p></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>ID</th><th>Gambar & Nama</th><th>Detail</th><th>Harga</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {data.map((item) => {
                const id = item.id ?? item._id;
                return (
                  <tr key={id}>
                    <td>#{id}</td>
                    <td>
                      <div className="table-main">
                        <img src={getImageUrl(item.image)} alt={getMainName(item)} onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/50?text=Gambar"; }} />
                        <div><strong>{getMainName(item)}</strong><span>{getSubName(item)}</span></div>
                      </div>
                    </td>
                    <td><div className="detail-cell">{getDetail(item)}</div></td>
                    <td>{getPrice(item)}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn" onClick={() => openEditModal(item)}><FaEdit /></button>
                        <button className="delete-btn" onClick={() => handleDelete(id)}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // ============================================================
  // RENDER RIWAYAT BEROBAT + KONSULTASI
  // ============================================================
  const renderMedicalRecords = () => {
    const keyword = search.toLowerCase().trim();

    const filteredRecordsByDate = filterByDateRange(
      medicalRecords, riwayatFilterType, riwayatFilterYear,
      riwayatFilterMonth, riwayatCustomStart, riwayatCustomEnd
    );
    const filteredRecords = filteredRecordsByDate.filter((r) =>
      !keyword || JSON.stringify(r).toLowerCase().includes(keyword)
    );

    const filteredConsultByDate = filterByDateRange(
      consultations, riwayatFilterType, riwayatFilterYear,
      riwayatFilterMonth, riwayatCustomStart, riwayatCustomEnd
    );
    const filteredConsult = filteredConsultByDate.filter((c) =>
      !keyword || JSON.stringify(c).toLowerCase().includes(keyword)
    );

    const countMenunggu = filteredConsult.filter((c) => c.status === "menunggu").length;
    const countDijawab = filteredConsult.filter((c) => c.status === "dijawab").length;
    const countSelesai = filteredConsult.filter((c) => c.status === "selesai").length;

    const availableYears = getAvailableYears([...medicalRecords, ...consultations]);

    const resetFilter = () => {
      setRiwayatFilterType("all");
      setRiwayatFilterYear("all");
      setRiwayatFilterMonth("all");
      setRiwayatCustomStart("");
      setRiwayatCustomEnd("");
    };

    return (
      <>
        <div className="med-tabs">
          <button
            onClick={() => { setMedicalTab("records"); setSearch(""); }}
            className={`med-tab-btn ${medicalTab === "records" ? "active-blue" : ""}`}
          >
            <FaFileMedical /> Riwayat Berobat ({medicalRecords.length})
          </button>
          <button
            onClick={() => { setMedicalTab("consultations"); setSearch(""); fetchConsultations(); }}
            className={`med-tab-btn ${medicalTab === "consultations" ? "active-purple" : ""}`}
          >
            <FaCommentMedical /> Konsultasi Masuk ({consultations.length})
            {consultations.filter((c) => c.status === "menunggu").length > 0 && (
              <span className="notif-badge">
                {consultations.filter((c) => c.status === "menunggu").length} baru
              </span>
            )}
          </button>
        </div>

        <div className="filter-panel">
          <div className="filter-header">
            <FaFilter className="filter-icon" />
            <strong>Filter Riwayat</strong>
            <span className="filter-count">
              Menampilkan {medicalTab === "records" ? filteredRecords.length : filteredConsult.length} data
            </span>
            {(riwayatFilterType !== "all") && (
              <button className="filter-reset" onClick={resetFilter}>Reset</button>
            )}
          </div>

          <div className="filter-chips">
            <button
              className={`filter-chip ${riwayatFilterType === "all" ? "active" : ""}`}
              onClick={resetFilter}
            >
              Semua Waktu
            </button>
            <button
              className={`filter-chip ${riwayatFilterType === "year" ? "active" : ""}`}
              onClick={() => { setRiwayatFilterType("year"); setRiwayatFilterYear(String(new Date().getFullYear())); }}
            >
              Per Tahun
            </button>
            <button
              className={`filter-chip ${riwayatFilterType === "month-year" ? "active" : ""}`}
              onClick={() => { setRiwayatFilterType("month-year"); setRiwayatFilterYear(String(new Date().getFullYear())); setRiwayatFilterMonth(String(new Date().getMonth())); }}
            >
              Per Bulan
            </button>
            <button
              className={`filter-chip ${riwayatFilterType === "custom" ? "active" : ""}`}
              onClick={() => setRiwayatFilterType("custom")}
            >
              Rentang Tanggal
            </button>
          </div>

          <div className="filter-inputs">
            {riwayatFilterType === "year" && (
              <div className="filter-group">
                <label>Pilih Tahun:</label>
                <select value={riwayatFilterYear} onChange={(e) => setRiwayatFilterYear(e.target.value)}>
                  <option value="all">Semua Tahun</option>
                  {availableYears.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            )}

            {riwayatFilterType === "month-year" && (
              <>
                <div className="filter-group">
                  <label>Tahun:</label>
                  <select value={riwayatFilterYear} onChange={(e) => setRiwayatFilterYear(e.target.value)}>
                    <option value="all">Semua Tahun</option>
                    {availableYears.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Bulan:</label>
                  <select value={riwayatFilterMonth} onChange={(e) => setRiwayatFilterMonth(e.target.value)}>
                    {BULAN_OPTIONS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                  </select>
                </div>
              </>
            )}

            {riwayatFilterType === "custom" && (
              <>
                <div className="filter-group">
                  <label>Dari Tanggal:</label>
                  <input type="date" value={riwayatCustomStart} onChange={(e) => setRiwayatCustomStart(e.target.value)} />
                </div>
                <div className="filter-group">
                  <label>Sampai Tanggal:</label>
                  <input type="date" value={riwayatCustomEnd} onChange={(e) => setRiwayatCustomEnd(e.target.value)} />
                </div>
              </>
            )}
          </div>
        </div>

        {medicalTab === "records" && (
          <div className="data-table-card">
            {filteredRecords.length === 0 ? (
              <div className="empty-state">
                <FaFileMedical style={{ fontSize: "2rem", color: "#ccc" }} />
                <h3>Belum ada riwayat berobat</h3>
                <p>Ubah filter atau tambahkan data baru.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th><th>Tanggal</th><th>Nama Hewan</th><th>Pemilik</th>
                      <th>Dokter</th><th>Diagnosa</th><th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((r) => {
                      const id = r.id ?? r._id;
                      return (
                        <tr key={id}>
                          <td>#{id}</td>
                          <td>{formatDateID(r.visitDate || r.visit_date || r.createdAt)}</td>
                          <td>
                            <strong>{r.petName || r.pet_name || "-"}</strong><br />
                            <small style={{ color: "#64748b" }}>{r.petType || r.pet_type || "-"}</small>
                          </td>
                          <td>
                            {r.ownerName || r.owner_name || "-"}<br />
                            <small style={{ color: "#64748b" }}>{r.ownerPhone || r.owner_phone || "-"}</small>
                          </td>
                          <td>{r.doctorName || r.doctor_name || "-"}</td>
                          <td>
                            <div style={{ maxWidth: "250px", fontSize: "0.85rem" }}>
                              <strong>Keluhan:</strong> {r.complaint || "-"}<br />
                              <strong>Diagnosa:</strong> {r.diagnosis || "-"}
                              {r.treatment && (<><br /><strong>Tindakan:</strong> {r.treatment}</>)}
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="edit-btn" onClick={() => openEditModal(r)}><FaEdit /></button>
                              <button className="delete-btn" onClick={() => handleDelete(id)}><FaTrash /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {medicalTab === "consultations" && (
          <>
            <div className="consult-summary">
              <span className="summary-chip warning">⏳ Menunggu: {countMenunggu}</span>
              <span className="summary-chip success">✅ Dijawab: {countDijawab}</span>
              <span className="summary-chip info">🏁 Selesai: {countSelesai}</span>
              <button className="refresh-btn" onClick={fetchConsultations}>
                <FaSyncAlt /> Refresh
              </button>
            </div>

            <div className="data-table-card">
              {filteredConsult.length === 0 ? (
                <div className="empty-state">
                  <FaCommentMedical style={{ fontSize: "2rem", color: "#ccc" }} />
                  <h3>Belum ada konsultasi</h3>
                  <p>Konsultasi dari pelanggan akan muncul di sini.</p>
                </div>
              ) : (
                <div className="consult-list">
                  {filteredConsult.map((c) => {
                    const id = c.id ?? c._id;
                    const statusColor =
                      c.status === "menunggu" ? "#f59e0b" :
                      c.status === "dijawab" ? "#10b981" : "#0000FF";
                    const statusLabel =
                      c.status === "menunggu" ? "Menunggu" :
                      c.status === "dijawab" ? "Dijawab" : "Selesai";

                    return (
                      <div
                        key={id}
                        className="consult-card"
                        style={{ borderLeftColor: statusColor }}
                      >
                        <div className="consult-header">
                          <span className="consult-id">KONSULTASI #{id}</span>
                          <h3>drh. {c.doctorName || "Dokter Hewan"}</h3>
                          <span className="consult-spec">
                            {c.doctorSpecialization || "Dokter Hewan"}
                          </span>
                          <span
                            className="consult-status-badge"
                            style={{ backgroundColor: statusColor }}
                          >
                            {statusLabel}
                          </span>
                        </div>

                        <div className="consult-info-grid">
                          <div className="consult-info-item">
                            <strong>👤 Pelanggan</strong>
                            <p>{c.userName || "-"}</p>
                            <small>📧 {c.userEmail || "-"}</small>
                            <small>📱 {c.userPhone || "-"}</small>
                          </div>
                          <div className="consult-info-item">
                            <strong>📅 Dikirim</strong>
                            <p>{formatDateTimeID(c.createdAt)}</p>
                          </div>
                        </div>

                        <div className="consult-block">
                          <strong>💬 Keluhan:</strong>
                          <p>{c.complaint || "-"}</p>
                        </div>

                        {c.reply && (
                          <div className="consult-block reply">
                            <strong>🩺 Balasan Dokter:</strong>
                            <p>{c.reply}</p>
                          </div>
                        )}

                        <div className="consult-actions">
                          <button
                            className="btn-reply"
                            onClick={() => openReplyModal(c)}
                          >
                            <FaReply /> {c.reply ? "Edit Balasan" : "Balas Sekarang"}
                          </button>
                          {c.status !== "selesai" && c.reply && (
                            <button
                              className="btn-done"
                              onClick={() => markConsultationDone(id)}
                            >
                              <FaCheck /> Tandai Selesai
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </>
    );
  };

  const renderUsers = () => {
    const keyword = search.toLowerCase().trim();
    const filteredUsers = users.filter((user) => !keyword || JSON.stringify(user).toLowerCase().includes(keyword));
    return (
      <div className="data-table-card">
        {filteredUsers.length === 0 ? (
          <div className="empty-state"><FaUsers /><h3>Belum ada user</h3><p>User yang register akan otomatis muncul.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>ID</th><th>Nama</th><th>Email</th><th>Aksi</th></tr></thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const id = user.id ?? user._id;
                  return (
                    <tr key={id}>
                      <td>#{id}</td>
                      <td><strong>{user.nama || user.name || "-"}</strong></td>
                      <td>{user.email || "-"}</td>
                      <td><button className="delete-btn" onClick={() => handleDelete(id)}><FaTrash /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderReviews = () => {
    const productReviews = reviews.filter(r => r.type === "product");
    const storeReviews = reviews.filter(r => r.type === "store");
    const data = reviewTab === "product" ? productReviews : storeReviews;
    const keyword = search.toLowerCase().trim();
    const filtered = data.filter((review) => !keyword || JSON.stringify(review).toLowerCase().includes(keyword));

    return (
      <div className="data-table-card">
        <div className="review-tabs">
          <button onClick={() => { setReviewTab("product"); setSearch(""); }} className={reviewTab === "product" ? "active" : ""}>
            <FaBox /> Produk ({productReviews.length})
          </button>
          <button onClick={() => { setReviewTab("store"); setSearch(""); }} className={reviewTab === "store" ? "active" : ""}>
            <FaStar /> Rating Toko ({storeReviews.length})
          </button>
        </div>
        {filtered.length === 0 ? (
          <div className="empty-state"><FaStar style={{ fontSize: "2rem", color: "#ccc" }} /><h3>Belum ada review</h3><p>Review dari pelanggan akan muncul di sini.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>ID</th><th>User</th><th>Item</th><th>Rating</th><th>Komentar</th><th>Tanggal</th><th>Aksi</th></tr></thead>
              <tbody>
                {filtered.map((review) => {
                  const id = review.id ?? review._id;
                  const itemName = review.type === "product" ? `Transaksi #${review.transactionId}` : "Rating toko";
                  const userName = review.userName || review.nama || "User";
                  const rating = Number(review.rating) || 0;
                  const comment = review.comment || review.review || review.content || "-";
                  const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString("id-ID") : "-";
                  return (
                    <tr key={id}>
                      <td>#{id}</td>
                      <td><strong>{userName}</strong></td>
                      <td>{itemName}</td>
                      <td><span style={{ color: "#fbbf24", fontWeight: 600 }}>{"★".repeat(rating)}{"☆".repeat(5 - rating)}<span style={{ color: "#333", marginLeft: "4px" }}>({rating})</span></span></td>
                      <td style={{ maxWidth: "200px", wordBreak: "break-word" }}>{comment}</td>
                      <td>{date}</td>
                      <td><button className="delete-btn" onClick={() => handleDelete(id)}><FaTrash /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderAdoptionRequests = () => {
    const keyword = search.toLowerCase().trim();
    const filtered = adoptionRequests.filter((request) => !keyword || JSON.stringify(request).toLowerCase().includes(keyword));

    return (
      <div className="adoption-requests-container">
        {filtered.length === 0 ? (
          <div className="data-table-card"><div className="empty-state"><FaUserCheck /><h3>Belum ada pengajuan adopsi</h3><p>Pengajuan dari pelanggan akan muncul di sini.</p></div></div>
        ) : (
          <div className="data-table-card">
            <div className="table-wrapper">
              <table>
                <thead><tr><th>ID</th><th>Nama Hewan</th><th>User</th><th>Jenis</th><th>Aksi</th></tr></thead>
                <tbody>
                  {filtered.map((request) => {
                    const id = request.id ?? request._id;
                    const rawStatus = normalizeStatus(request.status);
                    const animalId = request.animal_id ?? request.animalId;
                    const userId = request.user_id ?? request.userId;
                    const animalData = adoptionLookups.animalMap[String(animalId)];
                    const userData = adoptionLookups.userMap[String(userId)];
                    const namaHewan = request.nama_hewan || request.animalName || request.petName || animalData?.name || animalData?.petName || animalData?.nama || "Tidak tersedia";
                    const jenisHewan = request.jenis_hewan || request.animalType || request.petType || animalData?.animal || animalData?.type || animalData?.category || "Tidak tersedia";
                    const namaUser = request.nama_lengkap || request.userName || request.nama || userData?.nama || userData?.name || "Client";

                    return (
                      <tr key={id}>
                        <td>#{id}</td>
                        <td><strong>{namaHewan}</strong></td>
                        <td>{namaUser}</td>
                        <td>{jenisHewan}</td>
                        <td>
                          <div className="action-buttons">
                            {rawStatus === "pending" && (
                              <>
                                <button className="edit-btn" title="Setujui" onClick={() => updateAdoptionRequestStatus(id, "approved")} style={{ background: "#2d6a4f", color: "#fff" }}><FaCheck /></button>
                                <button className="delete-btn" title="Tolak" onClick={() => updateAdoptionRequestStatus(id, "rejected")} style={{ background: "#e74c3c", color: "#fff" }}><FaBan /></button>
                              </>
                            )}
                            {rawStatus === "approved" && <span>✅ Disetujui</span>}
                            {rawStatus === "rejected" && <span>❌ Ditolak</span>}
                            <button className="delete-btn" title="Hapus" onClick={() => deleteAdoptionRequest(id)}><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const getFilteredTransactions = (typeFilter) => {
    if (!typeFilter) return transactions;
    return transactions.filter((item) => {
      const type = String(item.type || "").toLowerCase();
      return typeFilter.includes(type);
    });
  };

  const renderOrderTable = (filteredOrders, title) => {
    const keyword = search.toLowerCase().trim();
    const filtered = filteredOrders.filter((item) => !keyword || JSON.stringify(item).toLowerCase().includes(keyword));
    const total = filteredOrders.length;
    const waiting = filteredOrders.filter((item) => normalizeStatus(item.status) === "pending").length;
    const packed = filteredOrders.filter((item) => normalizeStatus(item.status) === "dikemas").length;
    const shipped = filteredOrders.filter((item) => normalizeStatus(item.status) === "dikirim").length;
    const finished = filteredOrders.filter((item) => normalizeStatus(item.status) === "selesai").length;
    const paymentWaiting = filteredOrders.filter((item) => normalizePaymentStatus(item.paymentStatus || item.payment_status) === "menunggu_verifikasi").length;

    const toggleDropdown = (id) => setOpenDropdown(openDropdown === id ? null : id);

    return (
      <>
        <div className="page-heading booking-heading">
          <span className="eyebrow">MANAJEMEN</span>
          <div className="heading-row"><h1>{title}</h1><p>Kelola semua {title.toLowerCase()}.</p></div>
        </div>
        <div className="booking-summary">
          <div className="booking-summary-card"><div className="summary-icon"><FaClipboardList /></div><div><span>Total</span><strong>{total}</strong></div></div>
          <div className="booking-summary-card waiting-summary"><div className="summary-icon"><FaClock /></div><div><span>Menunggu</span><strong>{waiting}</strong></div></div>
          <div className="booking-summary-card packed-summary"><div className="summary-icon"><FaBox /></div><div><span>Dikemas</span><strong>{packed}</strong></div></div>
          <div className="booking-summary-card shipped-summary"><div className="summary-icon"><FaTruck /></div><div><span>Dikirim</span><strong>{shipped}</strong></div></div>
          <div className="booking-summary-card finished-summary"><div className="summary-icon"><FaCheck /></div><div><span>Selesai</span><strong>{finished}</strong></div></div>
          <div className="booking-summary-card payment-summary"><div className="summary-icon"><FaMoneyBillWave /></div><div><span>Verifikasi Bayar</span><strong>{paymentWaiting}</strong></div></div>
        </div>
        <div className="toolbar booking-toolbar">
          <div className="search-box"><FaSearch /><input placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="toolbar-actions"><button className="refresh-btn" onClick={fetchTransactions}><FaSyncAlt /> Refresh</button></div>
        </div>
        {loading && total === 0 ? (
          <div className="booking-empty"><FaSyncAlt /><h3>Memuat...</h3></div>
        ) : filtered.length === 0 ? (
          <div className="booking-empty"><FaClipboardList /><h3>Belum ada data</h3><button className="refresh-empty-btn" onClick={fetchTransactions}><FaSyncAlt /> Cek Lagi</button></div>
        ) : (
          <div className="data-table-card">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>ID</th><th>Jenis</th><th>Layanan</th><th>User</th><th>Tanggal / Waktu</th><th>Jumlah</th><th>Total</th><th>Pembayaran</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                  {filtered.map((item) => {
                    const id = item.id ?? item._id;
                    const status = normalizeStatus(item.status);
                    const paymentStatus = normalizePaymentStatus(item.paymentStatus || item.payment_status);
                    const type = String(item.type || "").toLowerCase();
                    const isBooking = ["grooming", "hotel", "dokter"].includes(type);
                    const userName = item.userName || item.nama || "-";
                    const userEmail = item.userEmail || item.email || "-";
                    const itemName = item.itemName || item.name || item.serviceName || "Layanan";
                    const bookingDate = item.date || item.bookingDate || item.booking_date || "-";
                    const bookingTime = item.time || item.bookingTime || item.booking_time || "-";
                    const quantity = Number(item.quantity || 1);
                    const total = Number(item.total || item.price || 0);
                    const paymentLabel = paymentStatus === "dibayar" ? "✅ Dibayar" : paymentStatus === "menunggu_verifikasi" ? "⏳ Verifikasi" : "❌ Belum Bayar";
                    const paymentClass = paymentStatus === "dibayar" ? "paid" : paymentStatus === "menunggu_verifikasi" ? "waiting" : "unpaid";

                    const handleAction = (action) => {
                      setOpenDropdown(null);
                      if (action === "setujui") approveBooking(id);
                      else if (action === "tolak") updateTransactionStatus(id, "ditolak");
                      else if (action === "selesai") updateTransactionStatus(id, "selesai");
                      else if (action === "kemas") updateTransactionStatus(id, "dikemas");
                      else if (action === "kirim") openShippingModal(item);
                      else if (action === "bayar") updatePaymentStatus(id, "dibayar");
                      else if (action === "hapus") deleteTransaction(id);
                    };

                    return (
                      <tr key={id}>
                        <td><strong>#{id}</strong></td>
                        <td><span className="badge badge-transaction">{type || "-"}</span></td>
                        <td>{itemName}</td>
                        <td><div><strong>{userName}</strong><br /><small><FaEnvelope /> {userEmail}</small></div></td>
                        <td><div><FaCalendarAlt /> {bookingDate}<br /><FaClock /> {bookingTime}</div></td>
                        <td>{quantity}</td>
                        <td><strong>{formatPrice(total)}</strong></td>
                        <td><span className={`payment-status-badge ${paymentClass}`}>{paymentLabel}</span></td>
                        <td>
                          <div className="dropdown-container">
                            <button className="dropdown-toggle" onClick={() => toggleDropdown(id)}><FaEllipsisV /></button>
                            {openDropdown === id && (
                              <div className="dropdown-menu">
                                {isBooking ? (
                                  <>
                                    {status === "pending" && (
                                      <>
                                        <button onClick={() => handleAction("setujui")} className="dropdown-item action-approve"><FaCheck /> Setujui</button>
                                        <button onClick={() => handleAction("tolak")} className="dropdown-item action-reject"><FaBan /> Tolak</button>
                                      </>
                                    )}
                                    {paymentStatus !== "dibayar" && status !== "ditolak" && status !== "selesai" && (
                                      <button onClick={() => handleAction("bayar")} className="dropdown-item action-pay"><FaMoneyCheckAlt /> Sudah Bayar</button>
                                    )}
                                    {paymentStatus === "menunggu_verifikasi" && (
                                      <button onClick={() => handleAction("bayar")} className="dropdown-item action-verify"><FaMoneyBillWave /> Verifikasi Bayar</button>
                                    )}
                                    {status === "dikemas" && (
                                      <button onClick={() => handleAction("selesai")} className="dropdown-item action-complete"><FaCheckDouble /> Selesai</button>
                                    )}
                                    {["selesai", "ditolak"].includes(status) && (
                                      <button onClick={() => handleAction("hapus")} className="dropdown-item action-delete"><FaTrash /> Hapus</button>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {status === "pending" && (
                                      <>
                                        <button onClick={() => handleAction("kemas")} className="dropdown-item action-pack"><FaBoxOpen /> Kemas</button>
                                        <button onClick={() => handleAction("tolak")} className="dropdown-item action-reject"><FaBan /> Tolak</button>
                                      </>
                                    )}
                                    {status === "dikemas" && (
                                      <button onClick={() => handleAction("kirim")} className="dropdown-item action-ship"><FaShippingFast /> Kirim</button>
                                    )}
                                    {status === "dikirim" && (
                                      <button onClick={() => handleAction("selesai")} className="dropdown-item action-complete"><FaCheckDouble /> Selesai</button>
                                    )}
                                    {paymentStatus !== "dibayar" && status !== "ditolak" && status !== "selesai" && (
                                      <button onClick={() => handleAction("bayar")} className="dropdown-item action-pay"><FaMoneyCheckAlt /> Sudah Bayar</button>
                                    )}
                                    {paymentStatus === "menunggu_verifikasi" && (
                                      <button onClick={() => handleAction("bayar")} className="dropdown-item action-verify"><FaMoneyBillWave /> Verifikasi Bayar</button>
                                    )}
                                    <button onClick={() => handleAction("hapus")} className="dropdown-item action-delete"><FaTrash /> Hapus</button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderTransactions = () => renderOrderTable(getFilteredTransactions(["produk", "adopsi"]), "Pesanan");
  const renderBookings = () => renderOrderTable(getFilteredTransactions(["grooming", "hotel", "dokter"]), "Booking");

  // ============================================================
  // KELOLA PENGIRIMAN
  // ============================================================
  const renderShipping = () => {
    const allProductOrders = transactions.filter((t) =>
      ["produk"].includes(String(t.type || "").toLowerCase())
    );

    let shippingOrders = [];
    if (shippingTab === "perlu_dikirim") {
      shippingOrders = allProductOrders.filter((t) =>
        ["pending", "dikemas"].includes(normalizeStatus(t.status))
      );
    } else if (shippingTab === "dikirim") {
      shippingOrders = allProductOrders.filter((t) => normalizeStatus(t.status) === "dikirim");
    } else if (shippingTab === "selesai") {
      shippingOrders = allProductOrders.filter((t) => normalizeStatus(t.status) === "selesai");
    } else {
      shippingOrders = allProductOrders;
    }

    const keyword = search.toLowerCase().trim();
    const filtered = shippingOrders.filter((item) =>
      !keyword || JSON.stringify(item).toLowerCase().includes(keyword)
    );

    const countPending = allProductOrders.filter((t) => ["pending", "dikemas"].includes(normalizeStatus(t.status))).length;
    const countShipped = allProductOrders.filter((t) => normalizeStatus(t.status) === "dikirim").length;
    const countDone = allProductOrders.filter((t) => normalizeStatus(t.status) === "selesai").length;
    const countAll = allProductOrders.length;

    return (
      <>
        <div className="page-heading">
          <span className="eyebrow">LOGISTIK</span>
          <div className="heading-row">
            <h1>Kelola Pengiriman</h1>
            <p>Input nomor resi & kurir untuk setiap pesanan produk.</p>
          </div>
        </div>

        <div className="shipping-tabs">
          {[
            { key: "perlu_dikirim", label: `Perlu Dikirim (${countPending})` },
            { key: "dikirim", label: `Dikirim (${countShipped})` },
            { key: "selesai", label: `Selesai (${countDone})` },
            { key: "semua", label: `Semua (${countAll})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setShippingTab(tab.key)}
              className={`shipping-tab ${shippingTab === tab.key ? "active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="toolbar">
          <div className="search-box">
            <FaSearch />
            <input type="text" placeholder="Cari ID pesanan, nama pelanggan, atau resi..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="toolbar-actions">
            <button className="refresh-btn" onClick={fetchTransactions}><FaSyncAlt /> Refresh</button>
          </div>
        </div>

        <div className="data-table-card">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <FaTruck style={{ fontSize: "2rem", color: "#ccc" }} />
              <h3>Tidak ada pesanan di kategori ini</h3>
              <p>Ubah tab filter atau cek kembali nanti.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th><th>Pelanggan</th><th>Alamat Tujuan</th><th>Status</th>
                    <th>Kurir</th><th>No. Resi</th><th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => {
                    const id = item.id ?? item._id;
                    const status = normalizeStatus(item.status);
                    const userName = item.userName || item.nama || "-";
                    const userPhone = item.userPhone || item.phone || "-";
                    const address = item.address || "-";
                    const city = item.city || "-";
                    const postalCode = item.postalCode || item.postal_code || "";
                    const customerCourier = item.courier || "-";
                    const trackingNumber = item.trackingNumber || item.no_resi || "";
                    const isShipped = status === "dikirim" || status === "selesai";

                    const badgeColor =
                      status === "pending" ? "#f59e0b" :
                      status === "dikemas" ? "#0000FF" :
                      status === "dikirim" ? "#8b5cf6" :
                      status === "selesai" ? "#10b981" : "#64748b";

                    return (
                      <tr key={id}>
                        <td><strong>#{id}</strong></td>
                        <td>
                          <div>
                            <strong>{userName}</strong><br />
                            <small style={{ color: "#64748b" }}><FaPhone /> {userPhone}</small>
                          </div>
                        </td>
                        <td>
                          <div style={{ maxWidth: "200px", fontSize: "0.85rem", color: "#475569" }}>
                            <FaMapMarkerAlt style={{ color: "#ef4444", marginRight: "4px" }} />
                            {address}<br />
                            <strong>{city}</strong> {postalCode && `- ${postalCode}`}
                          </div>
                        </td>
                        <td>
                          <span style={{
                            backgroundColor: badgeColor, color: "#fff",
                            padding: "4px 10px", borderRadius: "12px",
                            fontSize: "0.75rem", fontWeight: 700
                          }}>
                            {status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          {customerCourier && customerCourier !== "-" ? (
                            <span style={{
                              backgroundColor: "#e6e6ff", color: "#0000FF",
                              padding: "4px 10px", borderRadius: "6px",
                              fontSize: "0.85rem", fontWeight: 600
                            }}>
                              {customerCourier}
                            </span>
                          ) : (
                            <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Belum dipilih</span>
                          )}
                        </td>
                        <td>
                          {trackingNumber ? (
                            <strong style={{ color: "#1e293b", fontSize: "0.9rem" }}>{trackingNumber}</strong>
                          ) : (
                            <span style={{ color: "#ef4444", fontStyle: "italic", fontSize: "0.85rem" }}>⚠️ Belum diinput</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="primary-btn"
                            style={{
                              padding: "0.4rem 0.8rem", fontSize: "0.8rem",
                              backgroundColor: isShipped ? "#64748b" : "#0000FF",
                              display: "inline-flex", alignItems: "center", gap: "6px",
                              minHeight: "36px", borderRadius: "8px"
                            }}
                            onClick={() => openShippingModal(item)}
                          >
                            <FaEdit /> {isShipped ? "Update Resi" : "Input Resi"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>
    );
  };

  // ============================================================
  // LAPORAN — DENGAN QUICK FILTER
  // ============================================================
  const renderReports = () => {
    const filteredByDate = filterByQuickRange(
      transactions,
      reportQuickFilter,
      reportCustomStart,
      reportCustomEnd
    );

    const filteredByType = reportTypeFilter === "all"
      ? filteredByDate
      : filteredByDate.filter((t) => String(t.type).toLowerCase() === reportTypeFilter);

    const paidTransactions = filteredByType.filter(t => normalizePaymentStatus(t.paymentStatus || t.payment_status) === "dibayar");
    const totalRevenue = paidTransactions.reduce((sum, t) => sum + Number(t.total || t.price || 0), 0);
    const totalOrders = filteredByType.length;
    const totalPending = filteredByType.filter(t => normalizePaymentStatus(t.paymentStatus || t.payment_status) !== "dibayar").reduce((sum, t) => sum + Number(t.total || t.price || 0), 0);

    const productOrders = filteredByType.filter(t => String(t.type).toLowerCase() === "produk");
    const groomingOrders = filteredByType.filter(t => String(t.type).toLowerCase() === "grooming");
    const doctorOrders = filteredByType.filter(t => String(t.type).toLowerCase() === "dokter");
    const hotelOrders = filteredByType.filter(t => String(t.type).toLowerCase() === "hotel");

    const sumRevenue = (arr) => arr.filter(t => normalizePaymentStatus(t.paymentStatus || t.payment_status) === "dibayar").reduce((sum, t) => sum + Number(t.total || t.price || 0), 0);

    const rangeLabels = {
      today: "Hari Ini",
      thisWeek: "Minggu Ini",
      thisMonth: "Bulan Ini",
      thisYear: "Tahun Ini",
      lastMonth: "Bulan Lalu",
      lastYear: "Tahun Lalu",
      custom: "Rentang Kustom",
      all: "Semua Waktu",
    };
    const periodeText = rangeLabels[reportQuickFilter] || "Semua Waktu";

    const handlePrint = () => window.print();

    const resetFilter = () => {
      setReportQuickFilter("thisMonth");
      setReportCustomStart("");
      setReportCustomEnd("");
      setReportTypeFilter("all");
    };

    return (
      <>
        <div className="page-heading">
          <span className="eyebrow">STATISTIK & LAPORAN</span>
          <div className="heading-row">
            <h1>Laporan Pendapatan & Pesanan</h1>
            <p>Filter dan cetak laporan keuangan.</p>
          </div>
        </div>

        <div className="report-filter-panel">
          <div className="filter-header">
            <FaFilter className="filter-icon" />
            <strong>Filter Laporan</strong>
            <span className="filter-count">📅 {periodeText}</span>
          </div>

          <div className="report-filter-grid">
            <div className="filter-group">
              <label>Periode</label>
              <select value={reportQuickFilter} onChange={(e) => setReportQuickFilter(e.target.value)}>
                <option value="today">📅 Hari Ini</option>
                <option value="thisWeek">📆 Minggu Ini</option>
                <option value="thisMonth">🗓️ Bulan Ini</option>
                <option value="thisYear">📊 Tahun Ini</option>
                <option value="lastMonth">⏪ Bulan Lalu</option>
                <option value="lastYear">⏮️ Tahun Lalu</option>
                <option value="custom">🔧 Rentang Kustom</option>
                <option value="all">🌐 Semua Waktu</option>
              </select>
            </div>

            {reportQuickFilter === "custom" && (
              <>
                <div className="filter-group">
                  <label>Dari Tanggal</label>
                  <input type="date" value={reportCustomStart} onChange={(e) => setReportCustomStart(e.target.value)} />
                </div>
                <div className="filter-group">
                  <label>Sampai Tanggal</label>
                  <input type="date" value={reportCustomEnd} onChange={(e) => setReportCustomEnd(e.target.value)} />
                </div>
              </>
            )}

            <div className="filter-group">
              <label>Kategori</label>
              <select value={reportTypeFilter} onChange={(e) => setReportTypeFilter(e.target.value)}>
                <option value="all">Semua Kategori</option>
                <option value="produk">Produk</option>
                <option value="grooming">Grooming</option>
                <option value="dokter">Dokter</option>
                <option value="hotel">Pet Hotel</option>
              </select>
            </div>

            <div className="filter-group flex-grow">
              <label>Cari</label>
              <input
                type="text"
                placeholder="Cari pelanggan, ID, layanan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="report-filter-actions">
            <button className="filter-reset" onClick={resetFilter}>🔄 Reset</button>
            <button className="btn-print" onClick={handlePrint}>
              <FaPrint /> Cetak PDF
            </button>
          </div>
        </div>

        <div className="report-print-area">
          <div className="report-header-box">
            <div className="report-header-top">
              <div className="report-brand">
                <FaPaw className="report-brand-icon" />
                <div>
                  <h2>PetCare Hub Zalta</h2>
                  <p>Laporan Keuangan & Pesanan</p>
                </div>
              </div>
              <div className="report-meta">
                <p><strong>Periode:</strong> {periodeText}</p>
                <p><strong>Dicetak:</strong> {formatDateID(new Date())}</p>
              </div>
            </div>
          </div>

          <div className="report-stats">
            <div className="report-stat-card">
              <FaMoneyBillWave className="report-stat-icon success" />
              <span>Total Pendapatan</span>
              <strong>{formatPrice(totalRevenue)}</strong>
            </div>
            <div className="report-stat-card">
              <FaClipboardList className="report-stat-icon info" />
              <span>Total Pesanan</span>
              <strong>{totalOrders}</strong>
            </div>
            <div className="report-stat-card">
              <FaClock className="report-stat-icon warning" />
              <span>Belum Lunas</span>
              <strong>{formatPrice(totalPending)}</strong>
            </div>
            <div className="report-stat-card">
              <FaCheckDouble className="report-stat-icon success" />
              <span>Transaksi Lunas</span>
              <strong>{paidTransactions.length}</strong>
            </div>
          </div>

          <div className="report-section">
            <h3 className="report-section-title">📊 Rincian Pendapatan per Kategori</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Kategori Layanan</th>
                    <th>Jumlah Transaksi</th>
                    <th>Transaksi Lunas</th>
                    <th>Total Pendapatan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><strong>Produk</strong></td><td>{productOrders.length}</td><td>{productOrders.filter(t => normalizePaymentStatus(t.paymentStatus || t.payment_status) === "dibayar").length}</td><td>{formatPrice(sumRevenue(productOrders))}</td></tr>
                  <tr><td><strong>Grooming</strong></td><td>{groomingOrders.length}</td><td>{groomingOrders.filter(t => normalizePaymentStatus(t.paymentStatus || t.payment_status) === "dibayar").length}</td><td>{formatPrice(sumRevenue(groomingOrders))}</td></tr>
                  <tr><td><strong>Dokter Hewan</strong></td><td>{doctorOrders.length}</td><td>{doctorOrders.filter(t => normalizePaymentStatus(t.paymentStatus || t.payment_status) === "dibayar").length}</td><td>{formatPrice(sumRevenue(doctorOrders))}</td></tr>
                  <tr><td><strong>Pet Hotel</strong></td><td>{hotelOrders.length}</td><td>{hotelOrders.filter(t => normalizePaymentStatus(t.paymentStatus || t.payment_status) === "dibayar").length}</td><td>{formatPrice(sumRevenue(hotelOrders))}</td></tr>
                  <tr className="report-total-row">
                    <td>TOTAL</td>
                    <td>{totalOrders}</td>
                    <td>{paidTransactions.length}</td>
                    <td>{formatPrice(totalRevenue)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="report-section">
            <h3 className="report-section-title">📋 Detail Transaksi ({filteredByType.length})</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th><th>Tanggal</th><th>Pelanggan</th><th>Kategori</th><th>Layanan</th><th>Total</th><th>Pembayaran</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredByType.length === 0 ? (
                    <tr><td colSpan="7" className="empty-row">Tidak ada transaksi pada periode ini.</td></tr>
                  ) : (
                    filteredByType
                      .filter(t => !search || JSON.stringify(t).toLowerCase().includes(search.toLowerCase()))
                      .map((t) => {
                        const id = t.id ?? t._id;
                        const pStatus = normalizePaymentStatus(t.paymentStatus || t.payment_status);
                        const label = pStatus === "dibayar" ? "✅ Lunas" : pStatus === "menunggu_verifikasi" ? "⏳ Verifikasi" : "❌ Belum Bayar";
                        const color = pStatus === "dibayar" ? "#10b981" : pStatus === "menunggu_verifikasi" ? "#f59e0b" : "#ef4444";
                        return (
                          <tr key={id}>
                            <td>#{id}</td>
                            <td style={{ fontSize: "0.85rem" }}>{formatDateID(t.createdAt || t.date)}</td>
                            <td>{t.userName || t.nama || "-"}</td>
                            <td><span className="badge badge-transaction">{t.type || "-"}</span></td>
                            <td>{t.itemName || t.name || "-"}</td>
                            <td><strong>{formatPrice(t.total || t.price)}</strong></td>
                            <td><span style={{ color, fontWeight: 700, fontSize: "0.85rem" }}>{label}</span></td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="report-signatures">
            <div className="signature-block">
              <p>Dibuat oleh,</p>
              <div className="signature-space"></div>
              <p className="signature-line">Administrator</p>
            </div>
            <div className="signature-block">
              <p>Disetujui oleh,</p>
              <div className="signature-space"></div>
              <p className="signature-line">Atasan / Manajer</p>
            </div>
          </div>
        </div>
      </>
    );
  };

  // ============================================================
  // MODAL CRUD
  // ============================================================
  const renderModal = () => {
    if (!showModal) return null;
    const config = FORM_CONFIG[activeMenu] || [];
    return (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div><span className="eyebrow">FORM DATA</span><h2>{editingId ? "Edit Data" : "Tambah Data"}</h2></div>
            <button className="modal-close" type="button" onClick={() => setShowModal(false)}><FaTimes /></button>
          </div>
          <form className="admin-form" onSubmit={handleSubmit}>
            {config.map((field) => (
              <div className="form-group" key={field.name}>
                <label>{field.label}{field.required && <span>*</span>}</label>
                {field.type === "textarea" ? (
                  <textarea name={field.name} value={form[field.name] ?? ""} onChange={handleChange} rows="3" required={field.required} placeholder={`Masukkan ${field.label.toLowerCase()}...`} />
                ) : field.type === "select" ? (
                  <select name={field.name} value={form[field.name] ?? ""} onChange={handleChange} required={field.required}>
                    {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                ) : field.type === "file" ? (
                  <div className="image-upload-wrapper">
                    <input id={`upload-${field.name}`} name={field.name} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleChange} style={{ display: "none" }} />
                    <div className="image-upload-box" style={{ cursor: "pointer" }} onClick={() => document.getElementById(`upload-${field.name}`)?.click()}>
                      {form.imagePreview ? <img src={form.imagePreview} alt="Preview" className="image-preview" />
                       : form.image ? <img src={getImageUrl(form.image)} alt="Preview" className="image-preview" />
                       : <div className="upload-placeholder"><FaImage /><strong>Klik untuk memilih gambar</strong><span>JPG, JPEG, PNG atau WEBP</span><small>Maksimal 5 MB</small></div>}
                    </div>
                    {(form.image || form.imagePreview) && (
                      <button type="button" className="remove-image-btn" onClick={() => {
                        if (form.imagePreview?.startsWith("blob:")) URL.revokeObjectURL(form.imagePreview);
                        setForm((prev) => ({ ...prev, image: null, imagePreview: "" }));
                      }}><FaTimes /> Hapus Gambar</button>
                    )}
                  </div>
                ) : (
                  <input type={field.type} name={field.name} value={form[field.name] ?? ""} onChange={handleChange} required={field.required} placeholder={`Masukkan ${field.label.toLowerCase()}...`} />
                )}
              </div>
            ))}
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => {
                if (form.imagePreview?.startsWith("blob:")) URL.revokeObjectURL(form.imagePreview);
                setShowModal(false);
              }}>Batal</button>
              <button type="submit" className="save-btn"><FaCheck /> {editingId ? "Simpan Perubahan" : "Tambah Data"}</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderShippingModal = () => {
    if (!showShippingModal) return null;
    const currentOrder = transactions.find((t) => String(t.id ?? t._id) === String(shippingForm.id));
    const customerAddress = currentOrder ? `${currentOrder.address || "-"}, ${currentOrder.city || "-"} ${currentOrder.postalCode || ""}` : "-";
    const customerName = currentOrder?.userName || currentOrder?.nama || "-";

    return (
      <div className="modal-overlay" onClick={() => setShowShippingModal(false)}>
        <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px" }}>
          <div className="modal-header">
            <div><span className="eyebrow">PENGIRIMAN</span><h2>Input Data Pengiriman</h2></div>
            <button className="modal-close" type="button" onClick={() => setShowShippingModal(false)}><FaTimes /></button>
          </div>
          <div style={{ backgroundColor: "#f0f0ff", padding: "12px", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.9rem" }}>
            <p style={{ margin: "0 0 4px 0", color: "#0000FF" }}><strong>Pesanan #{String(shippingForm.id).slice(-8)}</strong></p>
            <p style={{ margin: "0 0 4px 0", color: "#475569" }}><FaUsers style={{ marginRight: "6px", color: "#0000FF" }} /> {customerName}</p>
            <p style={{ margin: 0, color: "#475569" }}><FaMapMarkerAlt style={{ marginRight: "6px", color: "#ef4444" }} /> {customerAddress}</p>
          </div>
          <form className="admin-form" onSubmit={handleShippingSubmit}>
            <div className="form-group">
              <label>Kurir / Ekspedisi <span>*</span></label>
              {shippingForm.customerCourier && (
                <p style={{ margin: "0 0 6px 0", fontSize: "0.8rem", color: "#0000FF", fontWeight: 600 }}>
                  💡 Pelanggan memilih: <strong>{shippingForm.customerCourier}</strong>
                </p>
              )}
              <select
                value={shippingForm.courier}
                onChange={(e) => setShippingForm({ ...shippingForm, courier: e.target.value })}
                required
              >
                <option value="">-- Pilih Kurir --</option>
                {COURIER_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Nomor Resi / Tracking <span>*</span></label>
              <input
                type="text"
                value={shippingForm.trackingNumber}
                onChange={(e) => setShippingForm({ ...shippingForm, trackingNumber: e.target.value })}
                required
                placeholder="Contoh: JNE-1234567890"
              />
            </div>
            <div style={{ backgroundColor: "#fff7ed", padding: "10px", borderRadius: "8px", fontSize: "0.8rem", color: "#92400e", marginBottom: "1rem" }}>
              ⚠️ Setelah disimpan, status pesanan otomatis berubah menjadi <strong>DIKIRIM</strong>.
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowShippingModal(false)}>Batal</button>
              <button type="submit" className="save-btn"><FaShippingFast /> Simpan & Kirim</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderReplyModal = () => {
    if (!showReplyModal || !selectedConsultation) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowReplyModal(false)}>
        <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "560px" }}>
          <div className="modal-header">
            <div>
              <span className="eyebrow">BALAS KONSULTASI</span>
              <h2>drh. {selectedConsultation.doctorName || "Dokter"}</h2>
            </div>
            <button className="modal-close" type="button" onClick={() => setShowReplyModal(false)}>
              <FaTimes />
            </button>
          </div>

          <div style={{ background: "#f0f0ff", padding: "1rem", borderRadius: "10px", marginBottom: "1rem" }}>
            <p style={{ margin: "0 0 6px 0", fontSize: "0.8rem", color: "#0000FF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              👤 Pelanggan
            </p>
            <p style={{ margin: "0 0 4px 0", color: "#0f172a", fontWeight: 700 }}>
              {selectedConsultation.userName || "-"}
            </p>
            <p style={{ margin: "0 0 12px 0", fontSize: "0.8rem", color: "#64748b" }}>
              {selectedConsultation.userEmail || "-"} • {selectedConsultation.userPhone || "-"}
            </p>

            <p style={{ margin: "0 0 6px 0", fontSize: "0.8rem", color: "#0000FF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              💬 Keluhan
            </p>
            <p style={{ margin: 0, color: "#334155", fontSize: "0.9rem", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
              {selectedConsultation.complaint || "-"}
            </p>
          </div>

          <div className="form-group">
            <label style={{ fontWeight: 700, marginBottom: "8px", display: "block" }}>
              Balasan / Saran Dokter <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Tulis diagnosa awal, saran perawatan, atau rekomendasi obat..."
              rows="6"
            />
          </div>

          <div style={{
            background: "#eff6ff", padding: "10px 14px", borderRadius: "8px",
            fontSize: "0.8rem", color: "#0000FF", marginBottom: "1rem",
            borderLeft: "3px solid #0000FF",
          }}>
            💡 Balasan langsung tampil di halaman <strong>Riwayat Pengobatan</strong> pelanggan.
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => setShowReplyModal(false)}>
              Batal
            </button>
            <button type="button" className="save-btn" onClick={submitConsultationReply}>
              <FaPaperPlane /> Kirim Balasan
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // SIDEBAR
  // ============================================================
  const renderSidebar = () => {
    const pendingCount = adoptionRequests.filter((request) => normalizeStatus(request.status) === "pending").length;
    const pendingConsult = consultations.filter((c) => c.status === "menunggu").length;

    return (
      <>
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
        <aside className={`admin-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
          <div className="admin-brand">
            <div className="brand-paw"><FaPaw /></div>
            <div><h2>PetCare Hub</h2><span>ZALTA ADMIN</span></div>
            <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}><FaTimes /></button>
          </div>
          <div className="menu-title">MENU UTAMA</div>
          <nav className="sidebar-menu">
            <button className={activeMenu === "dashboard" ? "menu-item active" : "menu-item"} onClick={() => { setActiveMenu("dashboard"); setSearch(""); setSidebarOpen(false); }}>
              <FaTachometerAlt /> <span>Dashboard</span>
            </button>
            <button className="menu-item master-toggle" onClick={() => setOpenMaster(!openMaster)}>
              <span className="menu-left"><FaList /> <span>Master Data</span></span>
              {openMaster ? <FaChevronDown /> : <FaChevronRight />}
            </button>
            {openMaster && (
              <div className="submenu">
                {[
                  ["products", "Produk", <FaBox />],
                  ["doctors", "Dokter", <FaStethoscope />],
                  ["grooming", "Grooming", <FaCut />],
                  ["hotels", "Pet Hotel", <FaHotel />],
                  ["adoptions", "Adopsi", <FaHeart />]
                ].map(([key, label, icon]) => (
                  <button key={key} className={activeMenu === key ? "submenu-item active" : "submenu-item"} onClick={() => { setActiveMenu(key); setSearch(""); setSidebarOpen(false); }}>
                    {icon} <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
            <button
              className={activeMenu === "medicalRecords" ? "menu-item active" : "menu-item"}
              onClick={() => {
                setActiveMenu("medicalRecords");
                setSearch("");
                setSidebarOpen(false);
                fetchMedicalRecords();
                fetchConsultations();
              }}
            >
              <FaFileMedical /> <span>Riwayat Berobat</span>
              {pendingConsult > 0 ? (
                <b className="notification-count">{pendingConsult}</b>
              ) : medicalRecords.length > 0 ? (
                <b className="menu-number">{medicalRecords.length}</b>
              ) : null}
            </button>
            <button className={activeMenu === "adoptionRequests" ? "menu-item active" : "menu-item"} onClick={() => { setActiveMenu("adoptionRequests"); setSearch(""); setSidebarOpen(false); fetchAdoptionRequests(); }}>
              <FaUserCheck /> <span>Pengajuan Adopsi</span>
              {pendingCount > 0 && <b className="notification-count">{pendingCount}</b>}
            </button>
            <button className={activeMenu === "transactions" ? "menu-item active" : "menu-item"} onClick={() => { setActiveMenu("transactions"); setSearch(""); setSidebarOpen(false); fetchTransactions(); }}>
              <FaClipboardList /> <span>Pesanan</span>
              {notification > 0 && <b className="notification-count">{notification}</b>}
            </button>
            <button className={activeMenu === "bookings" ? "menu-item active" : "menu-item"} onClick={() => { setActiveMenu("bookings"); setSearch(""); setSidebarOpen(false); fetchTransactions(); }}>
              <FaCut /> <span>Booking</span>
            </button>
            <button className={activeMenu === "shipping" ? "menu-item active" : "menu-item"} onClick={() => { setActiveMenu("shipping"); setSearch(""); setSidebarOpen(false); fetchTransactions(); }}>
              <FaTruck /> <span>Kelola Pengiriman</span>
            </button>
            <button className={activeMenu === "reviews" ? "menu-item active" : "menu-item"} onClick={() => { setActiveMenu("reviews"); setSearch(""); setSidebarOpen(false); }}>
              <FaStar /> <span>Review</span>
            </button>
            <button className={activeMenu === "users" ? "menu-item active" : "menu-item"} onClick={() => { setActiveMenu("users"); setSearch(""); setSidebarOpen(false); fetchUsers(); }}>
              <FaUsers /> <span>Users</span>
              <b className="menu-number">{users.length}</b>
            </button>
            <button className={activeMenu === "reports" ? "menu-item active" : "menu-item"} onClick={() => { setActiveMenu("reports"); setSearch(""); setSidebarOpen(false); fetchTransactions(); }}>
              <FaChartLine /> <span>Laporan</span>
            </button>
          </nav>
          <div className="sidebar-bottom">
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> <span>Logout</span>
            </button>
          </div>
        </aside>
      </>
    );
  };

  return (
    <div className="admin-layout">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <ConfirmDialog isOpen={confirmState.isOpen} message={confirmState.message} title={confirmState.title} onConfirm={handleConfirm} onCancel={handleCancelConfirm} />
      {renderSidebar()}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}><FaBars /></button>
            <div><span className="topbar-small">Admin Panel</span></div>
          </div>
          <div className="topbar-actions">
            <button className="notification-btn" onClick={() => { setActiveMenu("transactions"); fetchTransactions(); }}>
              <FaBell />
              {notification > 0 && <span>{notification}</span>}
            </button>
            <div className="admin-profile">
              <div className="admin-avatar"><FaUsers /></div>
              <div><strong>Administrator</strong><span>Admin</span></div>
            </div>
          </div>
        </header>
        <section className="admin-content">
          {activeMenu === "dashboard" && renderDashboard()}
          {["products", "doctors", "grooming", "hotels", "adoptions", "users", "reviews", "adoptionRequests", "medicalRecords"].includes(activeMenu) && renderCrud()}
          {activeMenu === "transactions" && renderTransactions()}
          {activeMenu === "bookings" && renderBookings()}
          {activeMenu === "shipping" && renderShipping()}
          {activeMenu === "reports" && renderReports()}
        </section>
      </main>
      {renderModal()}
      {renderShippingModal()}
      {renderReplyModal()}
    </div>
  );
}

// =====================================================
// STAT CARD
// =====================================================
function StatCard({ icon, title, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}

// =====================================================
// HELPERS untuk table
// =====================================================
function getMainName(item) {
  return item.name || item.serviceName || item.service_name || item.roomType || item.room_type || item.petName || item.pet_name || item.nama || item.userName || "-";
}

function getSubName(item) {
  const animal = item.animal || item.petType || item.pet_type || item.category_pet || item.kategori_hewan || "";
  const category = item.category || item.type || item.breed || item.specialization || item.role || "";
  return animal ? `${animal} • ${category}` : category || "-";
}

function getDetail(item) {
  return item.detail || item.description || item.breed || item.experience || item.facilities || item.duration || item.capacity || item.age || "-";
}

function getPrice(item) {
  const price = item.price ?? item.pricePerNight ?? item.price_per_night ?? item.amount ?? item.total;
  if (price === undefined || price === null) return "-";
  return formatPrice(price);
}

export default DashboardAdmin;