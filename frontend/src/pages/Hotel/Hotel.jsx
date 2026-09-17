import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaHotel,
  FaSearch,
  FaPaw,
  FaMoneyBillWave,
  FaCheckCircle,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaTimes,
  FaStar,
  FaClock,
  FaClipboardCheck,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaArrowLeft,
} from "react-icons/fa";

import api from "../../services/api";
import "./Hotel.css";

const SERVER_URL = "http://localhost:5000";

// =====================================================
// HITUNG JUMLAH MALAM
// =====================================================
const hitungMalam = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

const Hotel = () => {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // MODAL BOOKING
  const [showBooking, setShowBooking] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  // STATE BOOKING FORM
  const [bookingForm, setBookingForm] = useState({
    petName: "",
    petType: "",
    checkIn: "",
    checkOut: "",
    quantity: 1,
    phone: "",
    address: "",
    note: "",
  });

  const [bookingLoading, setBookingLoading] = useState(false);

  // DATA BOOKING USER
  const [myBookings, setMyBookings] = useState([]);
  const [bookingLoadingList, setBookingLoadingList] = useState(false);

  // REVIEW MODAL
  const [showReview, setShowReview] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, review: "" });

  // =====================================================
  // GET HOTEL
  // =====================================================
  const getHotels = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/hotels");
      setHotels(
        Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error("GET HOTEL ERROR:", err);
      setError("Data pet hotel gagal dimuat.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // USER HELPERS
  // =====================================================
  const getUser = () => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      return JSON.parse(raw) || null;
    } catch (error) {
      console.error("USER ERROR:", error);
      return null;
    }
  };

  const getUserId = () => {
    const user = getUser();
    if (!user) return null;
    const id =
      user.id ??
      user.Id_user ??
      user.Id_client ??
      user.id_client ??
      user.userId ??
      user.user_id ??
      null;
    return id;
  };

  const getUserEmail = () => {
    const user = getUser();
    if (!user) return "";
    return user.email || user.Email || user.email_user || "";
  };

  const getUserPhone = (user) => {
    if (!user) return "";
    return (
      user.no_telpon ||
      user.noTelpon ||
      user.phone ||
      user.no_hp ||
      user.noHP ||
      user.phoneNumber ||
      user.telepon ||
      ""
    );
  };

  const getUserAddress = (user) => {
    if (!user) return "";
    return (
      user.alamat ||
      user.address ||
      user.alamat_lengkap ||
      user.alamatLengkap ||
      ""
    );
  };

  // =====================================================
  // GET MY BOOKINGS
  // =====================================================
  const getMyBookings = async () => {
    const userId = getUserId();
    const email = getUserEmail();

    if (!userId && !email) {
      setMyBookings([]);
      return;
    }

    try {
      setBookingLoadingList(true);
      const url = `/transactions/user/${userId || 0}?email=${encodeURIComponent(
        email
      )}`;
      const response = await api.get(url);
      const data = response.data?.data || response.data;
      setMyBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("GET MY BOOKINGS ERROR:", error.response?.data || error);
      setMyBookings([]);
    } finally {
      setBookingLoadingList(false);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================
  useEffect(() => {
    getHotels();
    getMyBookings();

    // Jangan polling saat modal terbuka
    if (showBooking || showReview) return;

    const interval = setInterval(() => {
      getMyBookings();
    }, 10000);

    return () => clearInterval(interval);
  }, [showBooking, showReview]);

  // =====================================================
  // IMAGE
  // =====================================================
  const getImage = (image) => {
    if (!image) return "";
    if (image.startsWith("http://") || image.startsWith("https://"))
      return image;
    if (image.startsWith("/")) return `${SERVER_URL}${image}`;
    return `${SERVER_URL}/${image}`;
  };

  // =====================================================
  // SEARCH
  // =====================================================
  const filtered = hotels.filter((hotel) => {
    const keyword = search.toLowerCase().trim();
    return (
      !keyword ||
      hotel.name?.toLowerCase().includes(keyword) ||
      hotel.animal?.toLowerCase().includes(keyword) ||
      hotel.capacity?.toLowerCase().includes(keyword)
    );
  });

  // =====================================================
  // OPEN BOOKING
  // =====================================================
  const openBooking = (hotel) => {
    const user = getUser();
    if (!user) {
      alert("Silakan login terlebih dahulu untuk melakukan booking.");
      return;
    }

    setSelectedHotel(hotel);
    setBookingForm({
      petName: "",
      petType: hotel.animal || "",
      checkIn: "",
      checkOut: "",
      quantity: 1,
      phone: getUserPhone(user),
      address: getUserAddress(user),
      note: "",
    });
    setShowBooking(true);
  };

  const closeBooking = () => {
    if (bookingLoading) return;
    setShowBooking(false);
    setSelectedHotel(null);
  };

  // =====================================================
  // CHANGE HANDLERS
  // =====================================================
  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (
        updated.checkIn &&
        updated.checkOut &&
        new Date(updated.checkOut) <= new Date(updated.checkIn)
      ) {
        updated.checkOut = "";
      }

      const malam = hitungMalam(updated.checkIn, updated.checkOut);
      updated.quantity = malam > 0 ? malam : 1;

      return updated;
    });
  };

  // =====================================================
  // SUBMIT BOOKING
  // =====================================================
  const submitBooking = async (e) => {
    e.preventDefault();

    const user = getUser();
    const userId = getUserId();
    const userEmail = getUserEmail();

    if (!user || !userId) {
      alert("Session login tidak ditemukan. Silakan login kembali.");
      return;
    }
    if (!selectedHotel) {
      alert("Hotel belum dipilih.");
      return;
    }
    if (!bookingForm.petName.trim()) {
      alert("Nama hewan wajib diisi.");
      return;
    }
    if (!bookingForm.checkIn || !bookingForm.checkOut) {
      alert("Tanggal check-in & check-out wajib diisi.");
      return;
    }
    if (new Date(bookingForm.checkOut) <= new Date(bookingForm.checkIn)) {
      alert("Tanggal check-out harus setelah check-in.");
      return;
    }
    if (!bookingForm.phone.trim()) {
      alert("Nomor telepon wajib diisi.");
      return;
    }
    if (!bookingForm.address.trim()) {
      alert("Alamat wajib diisi.");
      return;
    }

    try {
      setBookingLoading(true);

      const price = Number(selectedHotel.price || 0);
      const quantity = Number(bookingForm.quantity || 1);
      const total = price * quantity;

      const itemData = {
        name: selectedHotel.name,
        itemName: selectedHotel.name,
        type: "hotel",
        hotelId: selectedHotel.id || selectedHotel._id,
        petName: bookingForm.petName,
        petType:
          bookingForm.petType || selectedHotel.animal || "Semua Hewan",
        checkIn: bookingForm.checkIn,
        checkOut: bookingForm.checkOut,
        quantity: quantity,
        price: price,
        subtotal: total,
        notes: bookingForm.note,
      };

      const payload = {
        items: [itemData],
        total: total,
        address: bookingForm.address,
        phone: bookingForm.phone,

        paymentMethod: "COD",
        paymentStatus: "belum_bayar",
        notes: bookingForm.note,

        userId: userId,
        userName: user.nama || user.name || user.username || "User",
        userEmail: userEmail,
        userPhone: bookingForm.phone,

        itemName: selectedHotel.name,
        type: "hotel",
        date: bookingForm.checkIn,
        time: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        quantity: quantity,
        price: price,

        hotelId: selectedHotel.id || selectedHotel._id,
        petName: bookingForm.petName,
        petType:
          bookingForm.petType || selectedHotel.animal || "Semua Hewan",
        checkIn: bookingForm.checkIn,
        checkOut: bookingForm.checkOut,
      };

      await api.post("/transactions", payload);

      alert(
        "Booking berhasil dikirim!\n\n" +
          "Silakan tunggu konfirmasi dari admin.\n" +
          "Pembayaran dilakukan di tempat (COD)."
      );

      setShowBooking(false);
      setSelectedHotel(null);
      setBookingForm({
        petName: "",
        petType: "",
        checkIn: "",
        checkOut: "",
        quantity: 1,
        phone: "",
        address: "",
        note: "",
      });

      setTimeout(() => getMyBookings(), 500);
    } catch (error) {
      console.error("BOOKING ERROR:", error.response?.data || error);
      alert(
        error.response?.data?.message ||
          "Booking gagal dikirim. Periksa koneksi server."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // =====================================================
  // REVIEW
  // =====================================================
  const openReview = (booking) => {
    setSelectedBooking(booking);
    setReviewForm({ rating: 5, review: "" });
    setShowReview(true);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;

    const user = getUser();
    const userId = getUserId();

    try {
      const payload = {
        userId: userId,
        userName: user?.nama || user?.name || "User",
        transactionId: selectedBooking.id || selectedBooking._id,
        bookingId: selectedBooking.id || selectedBooking._id,
        rating: Number(reviewForm.rating),
        review: reviewForm.review,
      };

      await api.post("/reviews", payload);
      alert("Review berhasil dikirim. Terima kasih.");

      setShowReview(false);
      setSelectedBooking(null);
      setReviewForm({ rating: 5, review: "" });
    } catch (error) {
      console.error("REVIEW ERROR:", error.response?.data || error);
      alert(error.response?.data?.message || "Review gagal dikirim.");
    }
  };

  // =====================================================
  // FORMAT STATUS
  // =====================================================
  const getStatusLabel = (status) => {
    switch (status) {
      case "menunggu":
        return "Menunggu Konfirmasi";
      case "dikemas":
      case "dikonfirmasi":
        return "Booking Dikonfirmasi";
      case "dikirim":
        return "Sedang Berlangsung";
      case "ditolak":
        return "Booking Ditolak";
      case "dibatalkan":
        return "Dibatalkan";
      case "selesai":
        return "Selesai";
      default:
        return status || "Menunggu";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "dikemas":
      case "dikonfirmasi":
      case "dikirim":
        return "status-confirmed";
      case "ditolak":
      case "dibatalkan":
        return "status-rejected";
      case "selesai":
        return "status-finished";
      default:
        return "status-pending";
    }
  };

  const getPaymentLabel = (status) => {
    switch (status) {
      case "belum_bayar":
        return "Belum Dibayar (COD)";
      case "menunggu_verifikasi":
        return "Menunggu Verifikasi";
      case "dibayar":
        return "Sudah Dibayar";
      default:
        return status || "Belum Dibayar (COD)";
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
      });
    } catch {
      return tgl;
    }
  };

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="hotel-page">
      {/* HERO */}
      <section className="hotel-hero">
        <div className="hotel-hero-overlay"></div>

        {/* TOMBOL KEMBALI */}
        <button
          className="hotel-back-btn"
          onClick={() => navigate(-1)}
          title="Kembali"
        >
          <FaArrowLeft />
          <span>Kembali</span>
        </button>

        <div className="hotel-hero-content">
          <span className="hotel-label">
            <FaHotel />
            PET HOTEL
          </span>
          <h1>
            Tempat Nyaman
            <br />
            <strong>Untuk Hewan Kesayangan</strong>
          </h1>
          <p>
            Tempat aman, nyaman, bersih, dan terpercaya untuk hewan kesayangan
            Anda.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="hotel-content">
        <div className="hotel-heading">
          <div>
            <small>PET HOTEL</small>
            <h2>Pilihan Hotel Hewan</h2>
            <p>
              Pilih kamar pet hotel yang sesuai dengan kebutuhan hewan
              kesayangan Anda.
            </p>
          </div>

          <div className="hotel-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Cari hotel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="hotel-state">
            <div className="hotel-spinner"></div>
            <p>Memuat data hotel...</p>
          </div>
        )}

        {!loading && error && (
          <div className="hotel-state error">
            <FaHotel />
            <p>{error}</p>
            <button onClick={getHotels}>Coba Lagi</button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="hotel-state">
            <FaHotel />
            <h3>Belum ada hotel</h3>
            <p>Admin belum menambahkan data pet hotel.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="hotel-grid">
            {filtered.map((hotel) => (
              <article className="hotel-card" key={hotel.id || hotel._id}>
                {/* GAMBAR — TANPA BADGE "Terverifikasi" */}
                <div className="hotel-image">
                  {hotel.image ? (
                    <img
                      src={getImage(hotel.image)}
                      alt={hotel.name}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="hotel-no-image">
                      <FaHotel />
                    </div>
                  )}
                </div>

                <div className="hotel-body">
                  <span className="hotel-animal">
                    <FaPaw />
                    {hotel.animal || "Semua Hewan"}
                  </span>

                  <h3>{hotel.name}</h3>

                  <p>
                    {hotel.description ||
                      "Tempat nyaman dan aman untuk hewan kesayangan."}
                  </p>

                  {hotel.facilities && (
                    <div className="hotel-facilities">
                      {hotel.facilities.split(",").map((facility, index) => (
                        <span key={index}>
                          <FaCheckCircle />
                          {facility.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="hotel-meta">
                    {hotel.capacity && (
                      <div>
                        <FaPaw />
                        <span>Kapasitas</span>
                        <strong>{hotel.capacity}</strong>
                      </div>
                    )}
                  </div>

                  {hotel.price && (
                    <div className="hotel-price">
                      <div>
                        <FaMoneyBillWave />
                        <span>Mulai dari</span>
                      </div>
                      <strong>
                        Rp {Number(hotel.price).toLocaleString("id-ID")}
                      </strong>
                      <small>/ malam</small>
                    </div>
                  )}

                  <button
                    className="hotel-book-btn"
                    onClick={() => openBooking(hotel)}
                  >
                    <FaHotel />
                    Booking Pet Hotel
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* MY BOOKINGS */}
        <section className="my-booking-section">
          <div className="booking-section-heading">
            <div>
              <small>BOOKING SAYA</small>
              <h2>Riwayat Pet Hotel</h2>
              <p>Pantau status booking dan review.</p>
            </div>
            <button className="refresh-booking" onClick={getMyBookings}>
              Refresh
            </button>
          </div>

          {bookingLoadingList ? (
            <div className="booking-loading">Memuat booking...</div>
          ) : myBookings.length === 0 ? (
            <div className="no-booking">
              <FaClipboardCheck />
              <h3>Belum ada booking</h3>
              <p>Booking pet hotel kamu akan muncul di sini.</p>
            </div>
          ) : (
            <div className="my-booking-grid">
              {myBookings.map((booking) => (
                <div
                  className="my-booking-card"
                  key={booking.id || booking._id}
                >
                  <div className="my-booking-top">
                    <div>
                      <small>BOOKING #{booking.id || booking._id}</small>
                      <h3>
                        {booking.itemName ||
                          booking.serviceName ||
                          "Pet Hotel"}
                      </h3>
                    </div>
                    <span
                      className={`booking-status ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>

                  <div className="booking-user-info">
                    <div>
                      <FaUser />
                      <span>Hewan</span>
                      <strong>{booking.petName || "-"}</strong>
                    </div>
                    <div>
                      <FaPaw />
                      <span>Jenis</span>
                      <strong>{booking.petType || booking.type || "-"}</strong>
                    </div>
                    <div>
                      <FaCalendarAlt />
                      <span>Check-in</span>
                      <strong>
                        {formatTanggal(booking.checkIn || booking.date)}
                      </strong>
                    </div>
                    <div>
                      <FaCalendarAlt />
                      <span>Check-out</span>
                      <strong>{formatTanggal(booking.checkOut) || "-"}</strong>
                    </div>
                    <div>
                      <FaMoneyBillWave />
                      <span>Total</span>
                      <strong>
                        Rp{" "}
                        {Number(
                          booking.total ||
                            Number(booking.price || 0) *
                              Number(booking.quantity || 1)
                        ).toLocaleString("id-ID")}
                      </strong>
                    </div>
                    <div>
                      <FaInfoCircle />
                      <span>Metode Bayar</span>
                      <strong>{booking.paymentMethod || "COD"}</strong>
                    </div>
                  </div>

                  <div className="booking-payment-status">
                    <span>Pembayaran</span>
                    <strong>{getPaymentLabel(booking.paymentStatus)}</strong>
                  </div>

                  <div className="booking-actions">
                    {booking.status === "menunggu" && (
                      <div className="waiting-message">
                        <FaClock />
                        Menunggu konfirmasi admin
                      </div>
                    )}

                    {(booking.status === "dikemas" ||
                      booking.status === "dikonfirmasi") &&
                      booking.paymentStatus === "belum_bayar" && (
                        <div className="cod-info">
                          <FaMoneyBillWave />
                          Booking dikonfirmasi. Bayar di tempat saat
                          check-in.
                        </div>
                      )}

                    {(booking.status === "ditolak" ||
                      booking.status === "dibatalkan") && (
                      <div className="rejected-message">
                        Booking {booking.status}.
                      </div>
                    )}

                    {booking.status === "selesai" && (
                      <button
                        className="review-booking-btn"
                        onClick={() => openReview(booking)}
                      >
                        <FaStar />
                        Berikan Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>

      {/* BOOKING MODAL */}
      {showBooking && selectedHotel && (
        <div className="hotel-modal-overlay" onClick={closeBooking}>
          <div className="hotel-modal" onClick={(e) => e.stopPropagation()}>
            <div className="hotel-modal-header">
              <div>
                <small>BOOKING PET HOTEL</small>
                <h2>{selectedHotel.name}</h2>
              </div>
              <button
                type="button"
                onClick={closeBooking}
                className="modal-close"
              >
                <FaTimes />
              </button>
            </div>

            <div className="selected-hotel-info">
              <div>
                <FaPaw />
                <span>Hewan</span>
                <strong>{selectedHotel.animal || "Semua Hewan"}</strong>
              </div>
              <div>
                <FaMoneyBillWave />
                <span>Harga / malam</span>
                <strong>
                  Rp{" "}
                  {Number(selectedHotel.price || 0).toLocaleString("id-ID")}
                </strong>
              </div>
            </div>

            <form
              onSubmit={submitBooking}
              className="hotel-booking-form"
              autoComplete="off"
            >
              <div className="form-field">
                <label>Nama Hewan</label>
                <div className="input-icon">
                  <FaPaw />
                  <input
                    type="text"
                    name="petName"
                    value={bookingForm.petName}
                    onChange={handleBookingChange}
                    placeholder="Contoh: Mochi"
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Jenis Hewan</label>
                <div className="input-icon">
                  <FaPaw />
                  <input
                    type="text"
                    name="petType"
                    value={bookingForm.petType}
                    onChange={handleBookingChange}
                    placeholder="Contoh: Kucing"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Tanggal Check-in</label>
                  <div className="input-icon">
                    <FaCalendarAlt />
                    <input
                      type="date"
                      name="checkIn"
                      min={new Date().toISOString().split("T")[0]}
                      value={bookingForm.checkIn}
                      onChange={handleDateChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Tanggal Check-out</label>
                  <div className="input-icon">
                    <FaCalendarAlt />
                    <input
                      type="date"
                      name="checkOut"
                      min={
                        bookingForm.checkIn ||
                        new Date().toISOString().split("T")[0]
                      }
                      value={bookingForm.checkOut}
                      onChange={handleDateChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-field">
                <label>Jumlah Malam (otomatis)</label>
                <input
                  type="number"
                  name="quantity"
                  value={bookingForm.quantity}
                  readOnly
                />
              </div>

              <div className="form-field">
                <label>
                  Nomor Telepon{" "}
                  {bookingForm.phone && (
                    <span className="auto-fill-note">
                      ✓ Terisi otomatis dari akun
                    </span>
                  )}
                </label>
                <div className="input-icon">
                  <FaPhone />
                  <input
                    type="text"
                    name="phone"
                    value={bookingForm.phone}
                    onChange={handleBookingChange}
                    placeholder="08xxxxxxxxxx"
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>
                  Alamat{" "}
                  {bookingForm.address && (
                    <span className="auto-fill-note">
                      ✓ Terisi otomatis dari akun
                    </span>
                  )}
                </label>
                <div className="input-icon">
                  <FaMapMarkerAlt />
                  <input
                    type="text"
                    name="address"
                    value={bookingForm.address}
                    onChange={handleBookingChange}
                    placeholder="Alamat lengkap"
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Catatan</label>
                <textarea
                  name="note"
                  value={bookingForm.note}
                  onChange={handleBookingChange}
                  placeholder="Catatan tambahan untuk pet hotel..."
                  rows="3"
                />
              </div>

              <div className="cod-info-box">
                <FaInfoCircle />
                <div>
                  <strong>Pembayaran: COD (Bayar di Tempat)</strong>
                  <p>Bayar saat check-in di pet hotel.</p>
                </div>
              </div>

              <div className="booking-total">
                <span>Estimasi Total</span>
                <strong>
                  Rp{" "}
                  {(
                    Number(selectedHotel.price || 0) *
                    Number(bookingForm.quantity || 1)
                  ).toLocaleString("id-ID")}
                </strong>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={closeBooking}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="modal-submit"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? (
                    "Mengirim..."
                  ) : (
                    <>
                      <FaClipboardCheck />
                      Ajukan Booking
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {showReview && selectedBooking && (
        <div
          className="hotel-modal-overlay"
          onClick={() => setShowReview(false)}
        >
          <div
            className="hotel-modal review-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="hotel-modal-header">
              <div>
                <small>REVIEW LAYANAN</small>
                <h2>Bagaimana pengalamanmu?</h2>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowReview(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={submitReview} className="hotel-booking-form">
              <div className="rating-select">
                <label>Rating</label>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={
                        star <= reviewForm.rating ? "star active" : "star"
                      }
                      onClick={() =>
                        setReviewForm((prev) => ({ ...prev, rating: star }))
                      }
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <label>Review</label>
                <textarea
                  value={reviewForm.review}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      review: e.target.value,
                    }))
                  }
                  placeholder="Ceritakan pengalaman kamu..."
                  rows="5"
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() => setShowReview(false)}
                >
                  Batal
                </button>
                <button type="submit" className="modal-submit">
                  <FaStar />
                  Kirim Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hotel;