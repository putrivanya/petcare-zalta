import React, { useEffect, useMemo, useState } from "react";
import "./DashboardAdmin.css";

import {
  FaTachometerAlt,
  FaBox,
  FaStethoscope,
  FaCut,
  FaPaw,
  FaList,
  FaClipboardList,
  FaUsers,
  FaStar,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaSyncAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaBan,
  FaMoneyBillWave,
  FaImage,
  FaHeart,
  FaChevronDown,
  FaChevronRight,
  FaCalendarAlt,
  FaEnvelope,
  FaClock,
  FaTruck,
  FaUserCheck,
  FaEllipsisV,
  FaInfoCircle,
  FaExclamationTriangle,
  FaBars,
  FaBoxOpen,
  FaShippingFast,
  FaCheckDouble,
  FaMoneyCheckAlt,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api";
const SERVER_URL = API_URL.replace("/api", "");

const ENDPOINTS = {
  products: "/products",
  doctors: "/doctors",
  grooming: "/grooming",
  adoptions: "/adoptions",
  transactions: "/transactions",
  reviews: "/reviews",
  users: "/users",
  adoptionRequests: "/adoption-requests",
};

const FORM_CONFIG = {
  products: [
    { name: "name", label: "Nama Produk", type: "text", required: true },
    { name: "animal", label: "Jenis / Kategori Hewan", type: "select", options: ["Anjing", "Kucing", "Kelinci", "Burung", "ikan","Hamster"], required: true },
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
};

const getImageUrl = (image) => {
  if (!image || typeof image !== "string") {
    return "https://via.placeholder.com/150?text=Tanpa+Gambar";
  }
  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("blob:")) {
    return image;
  }
  if (image.startsWith("/")) {
    return `${SERVER_URL}${image}`;
  }
  return `${SERVER_URL}/${image}`;
};

const normalizeStatus = (status) => {
  if (status === undefined || status === null || status === "") {
    return "pending";
  }
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
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(price || 0));
};

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
          <button className="toast-close" onClick={() => onRemove(toast.id)}>
            <FaTimes />
          </button>
          <div className="toast-progress" style={{ animationDuration: `${toast.duration}ms` }} />
        </div>
      ))}
    </div>
  );
};

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
  const [adoptions, setAdoptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [adoptionRequests, setAdoptionRequests] = useState([]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [notification, setNotification] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState({ isOpen: false, message: "", title: "Konfirmasi", onConfirm: null });
  const [reviewTab, setReviewTab] = useState("product");

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
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
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
      const commonKeys = ["data", "products", "doctors", "grooming", "adoptions", "users", "transactions", "bookings", "reviews", "adoptionRequests", "adoption_requests", "results", "items", "list", "records"];
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
  const fetchAdoptions = async () => { const data = await fetchData(ENDPOINTS.adoptions); setAdoptions(data); };
  const fetchReviews = async () => { const data = await fetchData(ENDPOINTS.reviews); setReviews(data); };
  const fetchUsers = async () => {
    const data = await fetchData(ENDPOINTS.users);
    setUsers(data);
    return data;
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
      if (!response.ok) {
        setAdoptionRequests([]);
        return [];
      }
      const data = await getResponseData(response);
      setAdoptionRequests(data);
      return data;
    } catch (error) {
      console.error("ADOPTION REQUEST ERROR:", error);
      setAdoptionRequests([]);
      return [];
    }
  };

  const calculateNotification = (transactionData = transactions, adoptionData = adoptionRequests) => {
    const waitingBooking = transactionData.filter((item) => normalizeStatus(item.status) === "pending").length;
    const waitingPayment = transactionData.filter((item) => normalizePaymentStatus(item.paymentStatus || item.payment_status) === "menunggu_verifikasi").length;
    const pendingAdoption = adoptionData.filter((item) => normalizeStatus(item.status) === "pending").length;
    setNotification(waitingBooking + waitingPayment + pendingAdoption);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const results = await Promise.all([
        fetchProducts(),
        fetchDoctors(),
        fetchGrooming(),
        fetchAdoptions(),
        fetchTransactions(),
        fetchReviews(),
        fetchUsers(),
        fetchAdoptionRequests(),
      ]);
      const transactionData = results[4] || [];
      const adoptionData = results[7] || [];
      calculateNotification(transactionData, adoptionData);
    } catch (error) {
      console.error("LOAD DATA ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllDataSilently = async () => {
    try {
      const results = await Promise.all([
        fetchProducts(),
        fetchDoctors(),
        fetchGrooming(),
        fetchAdoptions(),
        fetchTransactions(),
        fetchReviews(),
        fetchUsers(),
        fetchAdoptionRequests(),
      ]);
      calculateNotification(results[4] || [], results[7] || []);
    } catch (error) {
      console.error("BACKGROUND LOAD ERROR:", error);
    }
  };

  useEffect(() => {
    loadAllData();
    const interval = setInterval(() => { loadAllDataSilently(); }, 10000);
    return () => clearInterval(interval);
  }, []);

  const currentData = useMemo(() => {
    switch (activeMenu) {
      case "products": return products;
      case "doctors": return doctors;
      case "grooming": return grooming;
      case "adoptions": return adoptions;
      case "users": return users;
      case "reviews": return reviews;
      default: return [];
    }
  }, [activeMenu, products, doctors, grooming, adoptions, users, reviews]);

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
      case "adoptions": return "Adopsi";
      case "users": return "Users";
      case "reviews": return "Review";
      case "adoptionRequests": return "Pengajuan Adopsi";
      case "transactions": return "Pesanan";
      case "bookings": return "Booking";
      default: return "";
    }
  };

  const getSubtitle = () => {
    const t = getTitle();
    if (!t) return "";
    return `Kelola data ${t.toLowerCase()}.`;
  };

  const openAddModal = () => {
    if (["adoptionRequests", "transactions", "bookings", "users", "reviews"].includes(activeMenu)) return;
    setEditingId(null);
    const config = FORM_CONFIG[activeMenu] || [];
    const initial = {};
    config.forEach((field) => {
      if (["category", "type"].includes(field.name)) {
        initial[field.name] = field.options?.[0] || "";
      } else if (field.name === "animal") {
        initial[field.name] = "Anjing";
      } else if (field.options) {
        initial[field.name] = field.options[0] || "";
      } else if (field.type === "file") {
        initial[field.name] = null;
      } else {
        initial[field.name] = "";
      }
    });
    initial.imagePreview = "";
    setForm(initial);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    if (["adoptionRequests", "transactions", "bookings", "users", "reviews"].includes(activeMenu)) return;
    const id = item.id ?? item._id;
    setEditingId(id);
    setForm({
      ...item,
      imagePreview: item.image ? getImageUrl(item.image) : "",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      const file = files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        showToast("File harus berupa gambar.", "warning");
        e.target.value = "";
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast("Ukuran gambar maksimal 5 MB.", "warning");
        e.target.value = "";
        return;
      }
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
      if (!endpoint) {
        showToast("Menu ini tidak mendukung CRUD.", "warning");
        return;
      }
      const url = editingId ? `${API_URL}${endpoint}/${editingId}` : `${API_URL}${endpoint}`;
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (["imagePreview", "id", "_id", "createdAt", "updatedAt"].includes(key)) return;
        const value = form[key];
        if (value instanceof File) {
          formData.append(key, value);
          return;
        }
        if (key === "image" && typeof value === "string") return;
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
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
    showConfirm(
      "Yakin ingin menghapus data ini?",
      async () => {
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
      },
      "Hapus Data"
    );
  };

  const updateAdoptionRequestStatus = (id, status) => {
    const actionText = status === "approved" ? "menyetujui" : "menolak";
    showConfirm(
      `Yakin ingin ${actionText} pengajuan adopsi ini?`,
      async () => {
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
          calculateNotification(transactions, adoptionRequests);
        } catch (error) {
          console.error("UPDATE ADOPTION STATUS:", error);
          showToast(error.message || "Gagal mengubah status.", "error");
        }
      },
      "Konfirmasi Status"
    );
  };

  const deleteAdoptionRequest = (id) => {
    showConfirm(
      "Yakin ingin menghapus pengajuan adopsi ini?",
      async () => {
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
      },
      "Hapus Pengajuan"
    );
  };

  const updateTransactionStatus = (id, status) => {
    showConfirm(
      `Yakin mengubah status menjadi ${status}?`,
      async () => {
        try {
          const payload = { status };
          const response = await fetch(`${API_URL}/transactions/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", ...getAuthHeaders() },
            body: JSON.stringify(payload),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || "Gagal update transaksi.");
          await fetchTransactions();
          showToast("Status transaksi berhasil diperbarui.", "success");
        } catch (error) {
          console.error(error);
          showToast(error.message || "Gagal update transaksi.", "error");
        }
      },
      "Update Status"
    );
  };

  const updatePaymentStatus = (id, paymentStatus) => {
    showConfirm(
      `Yakin mengubah status pembayaran menjadi ${paymentStatus}?`,
      async () => {
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
      },
      "Update Pembayaran"
    );
  };

  const deleteTransaction = (id) => {
    showConfirm(
      "Yakin ingin menghapus pesanan ini?",
      async () => {
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
      },
      "Hapus Pesanan"
    );
  };

  const approveBooking = (id) => {
    showConfirm(
      "Setujui booking ini?",
      async () => {
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
      },
      "Setujui Booking"
    );
  };

  const handleLogout = () => {
    showConfirm("Yakin ingin logout?", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }, "Logout");
  };

  const renderDashboard = () => {
    const waitingBooking = transactions.filter((item) => normalizeStatus(item.status) === "pending").length;
    const waitingPayment = transactions.filter((item) => normalizePaymentStatus(item.paymentStatus || item.payment_status) === "menunggu_verifikasi").length;
    const pendingAdoption = adoptionRequests.filter((item) => normalizeStatus(item.status) === "pending").length;

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
          <StatCard icon={<FaHeart />} title="Adopsi" value={adoptions.length} />
          <StatCard icon={<FaUsers />} title="Users" value={users.length} />
          <StatCard icon={<FaClipboardList />} title="Pesanan" value={transactions.length} />
          <StatCard icon={<FaStar />} title="Review" value={reviews.length} />
          <StatCard icon={<FaUserCheck />} title="Pengajuan Adopsi" value={adoptionRequests.length} />
        </div>
        <div className="dashboard-bottom">
          <div className="welcome-card">
            <div>
              <span className="eyebrow">ADMIN PANEL</span>
              <h2>Kelola PetCare Hub dengan mudah.</h2>
              <p>Produk, dokter, grooming, adopsi, users, pesanan, booking, review, dan pengajuan adopsi.</p>
              <button onClick={() => setActiveMenu("products")}>Kelola Produk</button>
            </div>
            <div className="welcome-illustration"><FaPaw /></div>
          </div>
          <div className="waiting-card">
            <FaBell />
            <div>
              <span>Menunggu tindakan</span>
              <strong>{notification}</strong>
              <p>{waitingBooking} pesanan menunggu, {waitingPayment} pembayaran verifikasi, {pendingAdoption} pengajuan adopsi.</p>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderCrud = () => {
    const isReadOnly = ["users", "reviews", "adoptionRequests", "transactions", "bookings"].includes(activeMenu);
    const canAdd = !isReadOnly;

    return (
      <>
        <div className="page-heading">
          <span className="eyebrow">MASTER DATA</span>
          <div className="heading-row">
            <h1>{getTitle()}</h1>
            <p>{getSubtitle()}</p>
          </div>
        </div>
        <div className="toolbar">
          <div className="search-box">
            <FaSearch />
            <input type="text" placeholder={`Cari ${getTitle()}...`} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="toolbar-actions">
            <button className="refresh-btn" onClick={loadAllData}><FaSyncAlt /> Refresh</button>
            {canAdd && (
              <button className="primary-btn" onClick={openAddModal}>
                <FaPlus /> Tambah {getTitle()}
              </button>
            )}
          </div>
        </div>
        {activeMenu === "users" ? renderUsers() :
         activeMenu === "reviews" ? renderReviews() :
         activeMenu === "adoptionRequests" ? renderAdoptionRequests() :
         renderDataTable(filteredData)}
      </>
    );
  };

  const renderDataTable = (data) => {
    return (
      <div className="data-table-card">
        {loading && data.length === 0 ? (
          <div className="empty-state"><FaSyncAlt /><p>Memuat data...</p></div>
        ) : data.length === 0 ? (
          <div className="empty-state"><FaPaw /><h3>Belum ada data</h3><p>Silakan tambahkan data terlebih dahulu.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Gambar & Nama</th>
                  <th>Detail</th>
                  <th>Harga</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => {
                  const id = item.id ?? item._id;
                  return (
                    <tr key={id}>
                      <td>#{id}</td>
                      <td>
                        <div className="table-main">
                          <img
                            src={getImageUrl(item.image)}
                            alt={getMainName(item)}
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px", backgroundColor: "#f0f0f0" }}
                            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/50?text=Gambar"; }}
                          />
                          <div>
                            <strong>{getMainName(item)}</strong>
                            <span>{getSubName(item)}</span>
                          </div>
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
  };

  const renderUsers = () => {
    const keyword = search.toLowerCase().trim();
    const filteredUsers = users.filter((user) =>
      !keyword || JSON.stringify(user).toLowerCase().includes(keyword)
    );

    return (
      <div className="data-table-card">
        {filteredUsers.length === 0 ? (
          <div className="empty-state"><FaUsers /><h3>Belum ada user</h3><p>User yang melakukan register akan otomatis muncul di sini.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const id = user.id ?? user._id;
                  return (
                    <tr key={id}>
                      <td>#{id}</td>
                      <td><strong>{user.nama || user.name || "-"}</strong></td>
                      <td>{user.email || "-"}</td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDelete(id)}><FaTrash /></button>
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
  };

  const renderReviews = () => {
    const allReviews = reviews;
    const productReviews = allReviews.filter(r => r.type === "product");
    const storeReviews = allReviews.filter(r => r.type === "store");
    const currentData = reviewTab === "product" ? productReviews : storeReviews;
    const keyword = search.toLowerCase().trim();
    const filtered = currentData.filter((review) =>
      !keyword || JSON.stringify(review).toLowerCase().includes(keyword)
    );

    return (
      <div className="data-table-card">
        <div style={{ display: "flex", gap: "1rem", borderBottom: "2px solid #e9edf4", marginBottom: "1rem", paddingBottom: "0.5rem" }}>
          <button
            onClick={() => { setReviewTab("product"); setSearch(""); }}
            style={{
              background: reviewTab === "product" ? "#1e3a5f" : "transparent",
              color: reviewTab === "product" ? "#fff" : "#1e3a5f",
              border: "none",
              padding: "0.5rem 1.5rem",
              borderRadius: "6px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <FaBox style={{ marginRight: "6px" }} />
            Produk ({productReviews.length})
          </button>
          <button
            onClick={() => { setReviewTab("store"); setSearch(""); }}
            style={{
              background: reviewTab === "store" ? "#1e3a5f" : "transparent",
              color: reviewTab === "store" ? "#fff" : "#1e3a5f",
              border: "none",
              padding: "0.5rem 1.5rem",
              borderRadius: "6px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <FaStar style={{ marginRight: "6px" }} />
            Rating Toko ({storeReviews.length})
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <FaStar style={{ fontSize: "2rem", color: "#ccc" }} />
            <h3>Belum ada review</h3>
            <p>Review dari pelanggan akan muncul di sini.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Item</th>
                  <th>Rating</th>
                  <th>Komentar</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((review) => {
                  const id = review.id ?? review._id;
                  const itemName = review.type === "product"
                    ? `Transaksi #${review.transactionId}`
                    : "Rating toko";
                  const userName = review.userName || review.nama || "User";
                  const rating = Number(review.rating) || 0;
                  const comment = review.comment || review.review || review.content || "-";
                  const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString("id-ID") : "-";

                  return (
                    <tr key={id}>
                      <td>#{id}</td>
                      <td><strong>{userName}</strong></td>
                      <td>{itemName}</td>
                      <td>
                        <span style={{ color: "#fbbf24", fontWeight: 600 }}>
                          {"★".repeat(rating)}{"☆".repeat(5 - rating)}
                          <span style={{ color: "#333", marginLeft: "4px" }}>({rating})</span>
                        </span>
                      </td>
                      <td style={{ maxWidth: "200px", wordBreak: "break-word" }}>{comment}</td>
                      <td>{date}</td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDelete(id)}><FaTrash /></button>
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
  };

  const renderAdoptionRequests = () => {
    const keyword = search.toLowerCase().trim();
    const filtered = adoptionRequests.filter((request) =>
      !keyword || JSON.stringify(request).toLowerCase().includes(keyword)
    );

    return (
      <div className="adoption-requests-container">
        {filtered.length === 0 ? (
          <div className="data-table-card">
            <div className="empty-state"><FaUserCheck /><h3>Belum ada pengajuan adopsi</h3><p>Pengajuan dari pelanggan akan muncul di sini.</p></div>
          </div>
        ) : (
          <div className="data-table-card">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nama Hewan</th>
                    <th>User</th>
                    <th>Jenis</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
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
                                <button
                                  className="edit-btn"
                                  title="Setujui"
                                  onClick={() => updateAdoptionRequestStatus(id, "approved")}
                                  style={{ background: "#2d6a4f", color: "#fff" }}
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  className="delete-btn"
                                  title="Tolak"
                                  onClick={() => updateAdoptionRequestStatus(id, "rejected")}
                                  style={{ background: "#e74c3c", color: "#fff" }}
                                >
                                  <FaBan />
                                </button>
                              </>
                            )}
                            {rawStatus === "approved" && <span>✅ Disetujui</span>}
                            {rawStatus === "rejected" && <span>❌ Ditolak</span>}
                            <button className="delete-btn" title="Hapus" onClick={() => deleteAdoptionRequest(id)}>
                              <FaTrash />
                            </button>
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
    const filtered = filteredOrders.filter((item) =>
      !keyword || JSON.stringify(item).toLowerCase().includes(keyword)
    );
    const total = filteredOrders.length;
    const waiting = filteredOrders.filter((item) => normalizeStatus(item.status) === "pending").length;
    const packed = filteredOrders.filter((item) => normalizeStatus(item.status) === "dikemas").length;
    const shipped = filteredOrders.filter((item) => normalizeStatus(item.status) === "dikirim").length;
    const finished = filteredOrders.filter((item) => normalizeStatus(item.status) === "selesai").length;
    const paymentWaiting = filteredOrders.filter((item) => normalizePaymentStatus(item.paymentStatus || item.payment_status) === "menunggu_verifikasi").length;

    const toggleDropdown = (id) => {
      setOpenDropdown(openDropdown === id ? null : id);
    };

    return (
      <>
        <div className="page-heading booking-heading">
          <span className="eyebrow">MANAJEMEN</span>
          <div className="heading-row">
            <h1>{title}</h1>
            <p>Kelola semua {title.toLowerCase()}.</p>
          </div>
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
          <div className="toolbar-actions">
            <button className="refresh-btn" onClick={fetchTransactions}><FaSyncAlt /> Refresh</button>
          </div>
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
                  <tr>
                    <th>ID</th>
                    <th>Jenis</th>
                    <th>Layanan</th>
                    <th>User</th>
                    <th>Tanggal / Waktu</th>
                    <th>Jumlah</th>
                    <th>Total</th>
                    <th>Pembayaran</th>
                    <th>Aksi</th>
                  </tr>
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
                    const paymentLabel = paymentStatus === "dibayar" ? "✅ Dibayar" :
                                         paymentStatus === "menunggu_verifikasi" ? "⏳ Verifikasi" :
                                         "❌ Belum Bayar";
                    const paymentClass = paymentStatus === "dibayar" ? "paid" :
                                         paymentStatus === "menunggu_verifikasi" ? "waiting" :
                                         "unpaid";

                    const handleAction = (action) => {
                      setOpenDropdown(null);
                      if (action === "setujui") approveBooking(id);
                      else if (action === "tolak") updateTransactionStatus(id, "ditolak");
                      else if (action === "selesai") updateTransactionStatus(id, "selesai");
                      else if (action === "kemas") updateTransactionStatus(id, "dikemas");
                      else if (action === "kirim") updateTransactionStatus(id, "dikirim");
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
                                        <button onClick={() => handleAction("setujui")} className="dropdown-item action-approve">
                                          <FaCheck /> Setujui
                                        </button>
                                        <button onClick={() => handleAction("tolak")} className="dropdown-item action-reject">
                                          <FaBan /> Tolak
                                        </button>
                                      </>
                                    )}
                                    {paymentStatus !== "dibayar" && status !== "ditolak" && status !== "selesai" && (
                                      <button onClick={() => handleAction("bayar")} className="dropdown-item action-pay">
                                        <FaMoneyCheckAlt /> Sudah Bayar
                                      </button>
                                    )}
                                    {paymentStatus === "menunggu_verifikasi" && (
                                      <button onClick={() => handleAction("bayar")} className="dropdown-item action-verify">
                                        <FaMoneyBillWave /> Verifikasi Bayar
                                      </button>
                                    )}
                                    {status === "dikemas" && (
                                      <button onClick={() => handleAction("selesai")} className="dropdown-item action-complete">
                                        <FaCheckDouble /> Selesai
                                      </button>
                                    )}
                                    {["selesai", "ditolak"].includes(status) && (
                                      <button onClick={() => handleAction("hapus")} className="dropdown-item action-delete">
                                        <FaTrash /> Hapus
                                      </button>
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
                  <textarea name={field.name} value={form[field.name] ?? ""} onChange={handleChange} rows="4" required={field.required} placeholder={`Masukkan ${field.label.toLowerCase()}...`} />
                ) : field.type === "select" ? (
                  <select name={field.name} value={form[field.name] ?? ""} onChange={handleChange} required={field.required}>
                    {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                ) : field.type === "file" ? (
                  <div className="image-upload-wrapper">
                    <input id={`upload-${field.name}`} name={field.name} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleChange} style={{ display: "none" }} />
                    <div className="image-upload-box" style={{ cursor: "pointer" }} onClick={() => document.getElementById(`upload-${field.name}`)?.click()}>
                      {form.imagePreview ? (
                        <img src={form.imagePreview} alt="Preview" className="image-preview" />
                      ) : form.image ? (
                        <img src={getImageUrl(form.image)} alt="Preview" className="image-preview" />
                      ) : (
                        <div className="upload-placeholder"><FaImage /><strong>Klik untuk memilih gambar</strong><span>JPG, JPEG, PNG atau WEBP</span><small>Maksimal 5 MB</small></div>
                      )}
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

  const renderSidebar = () => {
    const pendingCount = adoptionRequests.filter((request) => normalizeStatus(request.status) === "pending").length;
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
                {[["products", "Produk", <FaBox />], ["doctors", "Dokter", <FaStethoscope />], ["grooming", "Grooming", <FaCut />], ["adoptions", "Adopsi", <FaHeart />]].map(([key, label, icon]) => (
                  <button key={key} className={activeMenu === key ? "submenu-item active" : "submenu-item"} onClick={() => { setActiveMenu(key); setSearch(""); setSidebarOpen(false); }}>
                    {icon} <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
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
            <button className={activeMenu === "reviews" ? "menu-item active" : "menu-item"} onClick={() => { setActiveMenu("reviews"); setSearch(""); setSidebarOpen(false); }}>
              <FaStar /> <span>Review</span>
            </button>
            <button className={activeMenu === "users" ? "menu-item active" : "menu-item"} onClick={() => { setActiveMenu("users"); setSearch(""); setSidebarOpen(false); fetchUsers(); }}>
              <FaUsers /> <span>Users</span>
              <b className="menu-number">{users.length}</b>
            </button>
          </nav>
          <div className="sidebar-bottom">
            <button
              className="logout-btn"
              onClick={handleLogout}
              style={{ backgroundColor: "#e74c3c", color: "#fff", border: "none", borderRadius: "4px", padding: "8px 16px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
            >
              <FaSignOutAlt /> <span>Logout</span>
            </button>
          </div>
        </aside>
      </>
    );
  };

  return (
    <div className="admin-layout">
      <style>{`
        .page-heading {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .page-heading .eyebrow {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 0.1rem;
        }
        .page-heading .heading-row {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .page-heading .heading-row h1 {
          font-size: 1.6rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }
        .page-heading .heading-row p {
          font-size: 1rem;
          color: #475569;
          margin: 0;
        }
        .toolbar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
          background: #fff;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          border: 1px solid #e9edf4;
        }
        .toolbar .search-box {
          display: flex;
          align-items: center;
          background: #f1f5f9;
          border-radius: 8px;
          padding: 0 0.6rem;
          flex: 1;
          min-width: 180px;
          max-width: 300px;
        }
        .toolbar .search-box input {
          border: none;
          background: transparent;
          padding: 0.5rem 0.6rem;
          width: 100%;
          outline: none;
          font-size: 0.9rem;
        }
        .toolbar .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: auto;
        }
        .table-wrapper { overflow-x: auto; }
        .table-wrapper table { min-width: 700px; }
        @media (max-width: 640px) {
          .page-heading .heading-row { flex-direction: column; align-items: center; gap: 0.2rem; }
          .page-heading .heading-row h1 { font-size: 1.3rem; }
          .page-heading .heading-row p { font-size: 0.9rem; }
          .toolbar { flex-direction: column; align-items: stretch; }
          .toolbar .search-box { max-width: 100%; min-width: unset; }
          .toolbar .toolbar-actions { margin-left: 0; justify-content: center; flex-wrap: wrap; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .dashboard-bottom { grid-template-columns: 1fr !important; }
          .booking-summary { grid-template-columns: 1fr 1fr !important; }
          .admin-topbar { flex-wrap: wrap; padding: 0.5rem 1rem; }
          .topbar-left strong { font-size: 0.9rem; }
          .admin-profile { display: none; }
          .modal { padding: 1rem; }
          .action-buttons button { width: 28px; height: 28px; font-size: 0.7rem; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 0.5rem; }
          .stat-card { padding: 0.5rem; }
          .stat-card .stat-icon { width: 30px; height: 30px; font-size: 0.8rem; }
          .stat-card strong { font-size: 1rem; }
        }
      `}</style>
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
          {["products", "doctors", "grooming", "adoptions", "users", "reviews", "adoptionRequests"].includes(activeMenu) && renderCrud()}
          {activeMenu === "transactions" && renderTransactions()}
          {activeMenu === "bookings" && renderBookings()}
        </section>
      </main>
      {renderModal()}
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div><span>{title}</span><strong>{value}</strong></div>
    </div>
  );
}

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