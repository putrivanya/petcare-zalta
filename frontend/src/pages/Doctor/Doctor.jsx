import React, { useEffect, useState } from "react";
import {
  FaStethoscope,
  FaPhone,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaSearch,
  FaUserMd,
  FaWhatsapp,
  FaArrowLeft,
  FaClipboardList,
  FaCommentMedical,
  FaTimes,
  FaCheckCircle,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Doctor.css";

const IMAGE_URL = "http://localhost:5000";

const Doctor = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // ====================================================
  // CONSULTATION STATE
  // ====================================================
  const [showConsultation, setShowConsultation] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [consultationForm, setConsultationForm] = useState({
    petName: "",
    complaint: "",
    phone: "",
  });
  const [consultLoading, setConsultLoading] = useState(false);

  // RIWAYAT KONSULTASI
  const [myConsultations, setMyConsultations] = useState([]);
  const [consultLoadingList, setConsultLoadingList] = useState(false);

  // ====================================================
  // USER HELPERS
  // ====================================================
  const getUser = () => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      return JSON.parse(raw) || null;
    } catch {
      return null;
    }
  };

  const getUserId = () => {
    const user = getUser();
    if (!user) return null;
    return (
      user.id ??
      user.Id_user ??
      user.Id_client ??
      user.id_client ??
      user.userId ??
      null
    );
  };

  const getUserEmail = () => {
    const user = getUser();
    if (!user) return "";
    return user.email || user.Email || "";
  };

  const getUserPhone = (user) => {
    if (!user) return "";
    return user.no_telpon || user.noTelpon || user.phone || "";
  };

  // ====================================================
  // GET DOCTORS
  // ====================================================
  const getDoctors = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/doctors");

      if (response.data && Array.isArray(response.data.data)) {
        setDoctors(response.data.data);
      } else if (Array.isArray(response.data)) {
        setDoctors(response.data);
      } else {
        setDoctors([]);
      }
    } catch (err) {
      console.error("GET DOCTORS ERROR:", err);
      setError("Data dokter gagal dimuat.");
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // GET MY CONSULTATIONS
  // ====================================================
  const getMyConsultations = async () => {
    const userId = getUserId();
    const email = getUserEmail();

    if (!userId && !email) {
      setMyConsultations([]);
      return;
    }

    try {
      setConsultLoadingList(true);
      const url = `/consultations/user/${userId || 0}?email=${encodeURIComponent(
        email
      )}`;
      const response = await api.get(url);
      const data = response.data?.data || response.data;
      setMyConsultations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("GET CONSULTATIONS ERROR:", error.response?.data || error);
      setMyConsultations([]);
    } finally {
      setConsultLoadingList(false);
    }
  };

  // ====================================================
  // LOAD DATA
  // ====================================================
  useEffect(() => {
    getDoctors();
    getMyConsultations();
  }, []);

  // Polling hanya kalau modal TIDAK terbuka
  useEffect(() => {
    if (showConsultation) return;

    const interval = setInterval(() => {
      getMyConsultations();
    }, 10000);

    return () => clearInterval(interval);
  }, [showConsultation]);

  // ====================================================
  // SEARCH
  // ====================================================
  const filteredDoctors = doctors.filter((doctor) => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return true;
    return (
      doctor.name?.toLowerCase().includes(keyword) ||
      doctor.specialization?.toLowerCase().includes(keyword) ||
      doctor.description?.toLowerCase().includes(keyword)
    );
  });

  // ====================================================
  // IMAGE
  // ====================================================
  const getImage = (image) => {
    if (!image) return null;
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    if (image.startsWith("/")) return `${IMAGE_URL}${image}`;
    return `${IMAGE_URL}/${image}`;
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === "") return "-";
    return Number(price).toLocaleString("id-ID");
  };

  // ====================================================
  // OPEN CONSULTATION MODAL
  // ====================================================
  const openConsultation = (doctor) => {
    const user = getUser();
    if (!user) {
      alert("Silakan login terlebih dahulu untuk konsultasi.");
      return;
    }

    setSelectedDoctor(doctor);
    setConsultationForm({
      petName: "",
      complaint: "",
      phone: getUserPhone(user),
    });
    setShowConsultation(true);
  };

  const closeConsultation = () => {
    if (consultLoading) return;
    setShowConsultation(false);
    setSelectedDoctor(null);
  };

  const handleConsultChange = (e) => {
    const { name, value } = e.target;
    setConsultationForm((prev) => ({ ...prev, [name]: value }));
  };

  // ====================================================
  // SUBMIT CONSULTATION
  // ====================================================
  const submitConsultation = async (e) => {
    e.preventDefault();

    const user = getUser();
    const userId = getUserId();
    const userEmail = getUserEmail();

    if (!user || !userId) {
      alert("Session login tidak ditemukan. Silakan login kembali.");
      return;
    }
    if (!selectedDoctor) {
      alert("Dokter belum dipilih.");
      return;
    }
    if (!consultationForm.complaint.trim()) {
      alert("Keluhan wajib diisi.");
      return;
    }
    if (!consultationForm.phone.trim()) {
      alert("Nomor telepon wajib diisi.");
      return;
    }

    try {
      setConsultLoading(true);

      const payload = {
        userId: userId,
        userName: user.nama || user.name || user.username || "User",
        userEmail: userEmail,
        userPhone: consultationForm.phone,
        doctorId: selectedDoctor.id || selectedDoctor._id,
        doctorName: selectedDoctor.name || "",
        doctorSpecialization: selectedDoctor.specialization || "",
        complaint: `[Hewan: ${
          consultationForm.petName || "Tidak disebutkan"
        }]\n\n${consultationForm.complaint}`,
      };

      await api.post("/consultations", payload);

      alert(
        "Konsultasi berhasil dikirim!\n\n" +
          "Dokter akan membalas melalui halaman ini.\n" +
          "Cek 'Riwayat Pengobatan' di bawah untuk melihat balasan."
      );

      setShowConsultation(false);
      setSelectedDoctor(null);
      setConsultationForm({ petName: "", complaint: "", phone: "" });

      setTimeout(() => getMyConsultations(), 500);
    } catch (error) {
      console.error("CONSULTATION ERROR:", error.response?.data || error);
      alert(
        error.response?.data?.message ||
          "Konsultasi gagal dikirim. Periksa koneksi server."
      );
    } finally {
      setConsultLoading(false);
    }
  };

  // ====================================================
  // WHATSAPP LANJUTAN
  // ====================================================
  const handleWhatsAppFollowUp = (consultation) => {
    if (!consultation.doctorId) return;

    const doctor = doctors.find(
      (d) =>
        String(d.id || d._id) === String(consultation.doctorId)
    );

    if (!doctor || !doctor.phone) {
      alert("Nomor WhatsApp dokter belum tersedia.");
      return;
    }

    let phone = String(doctor.phone).replace(/\D/g, "");
    if (phone.startsWith("0")) phone = "62" + phone.substring(1);
    if (!phone.startsWith("62")) phone = "62" + phone;

    const message = encodeURIComponent(
      `Halo Dokter ${doctor.name || ""},\n\n` +
        `Saya ingin melanjutkan konsultasi.\n\n` +
        `Keluhan saya: ${
          consultation.complaint || "(lihat di web)"
        }\n\n` +
        `Balasan dokter: ${
          consultation.reply || "(lihat di web)"
        }\n\n` +
        `Terima kasih.`
    );

    window.open(
      `https://wa.me/${phone}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleConsultation = (doctor) => {
    openConsultation(doctor);
  };

  // ====================================================
  // STATUS HELPERS
  // ====================================================
  const getConsultStatusLabel = (status) => {
    switch (status) {
      case "menunggu":
        return "Menunggu Balasan";
      case "dijawab":
        return "Sudah Dijawab";
      case "selesai":
        return "Selesai";
      default:
        return status || "Menunggu";
    }
  };

  const getConsultStatusClass = (status) => {
    switch (status) {
      case "dijawab":
        return "status-dijawab";
      case "selesai":
        return "status-selesai";
      default:
        return "status-menunggu";
    }
  };

  const formatTanggal = (tgl) => {
    if (!tgl) return "-";
    try {
      const d = new Date(tgl);
      if (isNaN(d.getTime())) return tgl;
      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return tgl;
    }
  };

  const goBack = () => navigate(-1);

  // ====================================================
  // RENDER
  // ====================================================
  return (
    <div className="doctor-page">
      {/* HERO */}
      <section className="doctor-hero">
        <div className="doctor-hero-content">
          <div className="back-button-container">
            <button
              type="button"
              className="back-button"
              onClick={goBack}
            >
              <FaArrowLeft /> Kembali
            </button>
          </div>

          <span className="doctor-label">
            <FaStethoscope />
            PETCARE MEDICAL
          </span>

          <h1>
            Dokter Hewan
            <span> Terpercaya</span>
          </h1>

          <p>
            Temukan dokter hewan terbaik yang tersedia di PetCare Hub Zalta.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="doctor-content">
        <div className="doctor-heading">
          <div>
            <span className="section-small">LAYANAN DOKTER</span>
            <h2>Pilih Dokter Hewan</h2>
            <p>
              Klik "Konsultasi Sekarang" untuk mengirim keluhan ke dokter.
            </p>
          </div>

          <div className="doctor-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Cari dokter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="doctor-state">
            <div className="loading-spinner"></div>
            <p>Memuat data dokter...</p>
          </div>
        )}

        {!loading && error && (
          <div className="doctor-state error">
            <FaStethoscope />
            <p>{error}</p>
            <button type="button" onClick={getDoctors}>
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && filteredDoctors.length === 0 && (
          <div className="doctor-state">
            <FaUserMd />
            <h3>Dokter belum tersedia</h3>
            <p>
              {search
                ? `Dokter dengan kata "${search}" tidak ditemukan.`
                : "Belum ada data dokter yang ditambahkan oleh admin."}
            </p>
          </div>
        )}

        {!loading && !error && filteredDoctors.length > 0 && (
          <div className="doctor-grid">
            {filteredDoctors.map((doctor) => (
              <article
                className="doctor-card"
                key={doctor.id || doctor._id}
              >
                <div className="doctor-image">
                  {doctor.image ? (
                    <img
                      src={getImage(doctor.image)}
                      alt={doctor.name || "Dokter Hewan"}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="doctor-no-image">
                      <FaUserMd />
                    </div>
                  )}
                </div>

                <div className="doctor-card-body">
                  <span className="doctor-specialization">
                    <FaStethoscope />
                    {doctor.specialization || "Dokter Hewan"}
                  </span>

                  <h3>{doctor.name || "Dokter Hewan"}</h3>

                  {doctor.description && (
                    <p className="doctor-description">
                      {doctor.description}
                    </p>
                  )}

                  <div className="doctor-info">
                    {doctor.price !== undefined &&
                      doctor.price !== null &&
                      doctor.price !== "" && (
                        <div>
                          <FaMoneyBillWave />
                          <span>Rp {formatPrice(doctor.price)}</span>
                        </div>
                      )}

                    {doctor.schedule && (
                      <div>
                        <FaCalendarAlt />
                        <span>{doctor.schedule}</span>
                      </div>
                    )}

                    {doctor.phone && (
                      <div>
                        <FaPhone />
                        <span>{doctor.phone}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="doctor-button"
                    onClick={() => handleConsultation(doctor)}
                  >
                    <FaCommentMedical />
                    <span>Konsultasi Sekarang</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ==================================================
            RIWAYAT PENGOBATAN
        ================================================== */}
        <section className="consultation-section">
          <div className="consultation-heading">
            <div>
              <small>RIWAYAT PENGOBATAN</small>
              <h2>Konsultasi Saya</h2>
              <p>Semua konsultasi & balasan dokter muncul di sini.</p>
            </div>
            <button
              className="refresh-consultation"
              onClick={getMyConsultations}
            >
              Refresh
            </button>
          </div>

          {consultLoadingList ? (
            <div className="consultation-empty">Memuat konsultasi...</div>
          ) : myConsultations.length === 0 ? (
            <div className="consultation-empty">
              <FaClipboardList />
              <h3>Belum ada konsultasi</h3>
              <p>Konsultasi kamu akan muncul di sini.</p>
            </div>
          ) : (
            <div className="consultation-list">
              {myConsultations.map((c) => (
                <div className="consultation-card" key={c.id}>
                  <div className="consultation-top">
                    <div>
                      <small>KONSULTASI #{c.id}</small>
                      <h3>drh. {c.doctorName || "Dokter Hewan"}</h3>
                      <span className="consult-spec">
                        {c.doctorSpecialization || "Dokter Hewan"}
                      </span>
                    </div>
                    <span
                      className={`consult-status ${getConsultStatusClass(
                        c.status
                      )}`}
                    >
                      {c.status === "dijawab" && <FaCheckCircle />}
                      {c.status === "menunggu" && <FaClock />}
                      {getConsultStatusLabel(c.status)}
                    </span>
                  </div>

                  <div className="consultation-block">
                    <strong>
                      <FaCommentMedical /> Keluhan:
                    </strong>
                    <p>{c.complaint || "-"}</p>
                  </div>

                  {c.reply ? (
                    <div className="consultation-block reply">
                      <strong>
                        <FaCheckCircle /> Balasan Dokter:
                      </strong>
                      <p>{c.reply}</p>
                    </div>
                  ) : (
                    <div className="consultation-block waiting">
                      <FaClock />
                      <span>Menunggu balasan dokter...</span>
                    </div>
                  )}

                  <div className="consultation-meta">
                    <span>Dikirim: {formatTanggal(c.createdAt)}</span>
                    {c.reply && (
                      <span>Dibalas: {formatTanggal(c.updatedAt)}</span>
                    )}
                  </div>

                  {c.reply && (
                    <button
                      className="wa-followup-btn"
                      onClick={() => handleWhatsAppFollowUp(c)}
                    >
                      <FaWhatsapp />
                      Lanjut via WhatsApp
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </section>

      {/* ==================================================
          MODAL KONSULTASI
      ================================================== */}
      {showConsultation && selectedDoctor && (
        <div className="doctor-modal-overlay" onClick={closeConsultation}>
          <div
            className="doctor-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="doctor-modal-header">
              <div>
                <small>KONSULTASI DOKTER</small>
                <h2>drh. {selectedDoctor.name}</h2>
                <span className="modal-spec">
                  {selectedDoctor.specialization || "Dokter Hewan"}
                </span>
              </div>
              <button
                type="button"
                onClick={closeConsultation}
                className="modal-close"
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={submitConsultation}
              className="doctor-consult-form"
              autoComplete="off"
            >
              <div className="form-field">
                <label>Nama Hewan</label>
                <input
                  type="text"
                  name="petName"
                  value={consultationForm.petName}
                  onChange={handleConsultChange}
                  placeholder="Contoh: Mochi"
                  autoComplete="off"
                />
              </div>

              <div className="form-field">
                <label>Nomor Telepon</label>
                <input
                  type="text"
                  name="phone"
                  value={consultationForm.phone}
                  onChange={handleConsultChange}
                  placeholder="08xxxxxxxxxx"
                  autoComplete="off"
                  required
                />
              </div>

              <div className="form-field">
                <label>
                  Keluhan / Gejala <span className="required">*</span>
                </label>
                <textarea
                  name="complaint"
                  value={consultationForm.complaint}
                  onChange={handleConsultChange}
                  placeholder="Jelaskan keluhan hewan Anda secara detail..."
                  rows="6"
                  required
                />
              </div>

              <div className="consult-info-box">
                <FaCommentMedical />
                <div>
                  <strong>Bagaimana cara kerjanya?</strong>
                  <p>
                    Dokter akan membalas di halaman ini. Anda juga bisa
                    lanjut chat via WhatsApp setelah dibalas.
                  </p>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={closeConsultation}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="modal-submit"
                  disabled={consultLoading}
                >
                  {consultLoading ? (
                    "Mengirim..."
                  ) : (
                    <>
                      <FaPaperPlane />
                      Kirim Konsultasi
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctor;