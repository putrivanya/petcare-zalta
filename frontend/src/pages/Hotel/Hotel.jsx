import React, { useEffect, useState } from "react";

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
  FaCreditCard,
  FaStar,
  FaClock,
  FaClipboardCheck,
} from "react-icons/fa";

import api from "../../services/api";
import "./Hotel.css";

const SERVER_URL = "http://localhost:5000";

const Hotel = () => {
  const [hotels, setHotels] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  // MODAL BOOKING
  const [showBooking, setShowBooking] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    petName: "",
    petType: "",
    date: "",
    quantity: 1,
    phone: "",
    note: "",
  });

  const [bookingLoading, setBookingLoading] = useState(false);

  // DATA BOOKING USER
  const [myBookings, setMyBookings] = useState([]);
  const [bookingLoadingList, setBookingLoadingList] = useState(false);

  // PAYMENT MODAL
  const [showPayment, setShowPayment] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [paymentForm, setPaymentForm] = useState({
    method: "Transfer Bank",
    proof: null,
  });

  // REVIEW MODAL
  const [showReview, setShowReview] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review: "",
  });

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
  // GET USER
  // =====================================================

  const getUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      return user || null;
    } catch (error) {
      console.error("USER ERROR:", error);

      return null;
    }
  };

  // =====================================================
  // GET ID USER
  // =====================================================

  const getUserId = () => {
    const user = getUser();

    if (!user) return null;

    return (
      user.id ||
      user.Id_user ||
      user.Id_client ||
      user.id_client ||
      user.userId
    );
  };

  // =====================================================
  // GET BOOKING USER
  // =====================================================

  const getMyBookings = async () => {
    const userId = getUserId();

    if (!userId) {
      setMyBookings([]);
      return;
    }

    try {
      setBookingLoadingList(true);

      /*
       * Endpoint ini disesuaikan dengan sistem transaksi
       * Dashboard Admin kamu.
       */
      const response = await api.get(
        `/transactions/user/${userId}`
      );

      const data = response.data?.data || response.data;

      setMyBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("GET MY BOOKINGS ERROR:", error);

      /*
       * Jangan bikin halaman hotel rusak hanya karena
       * endpoint booking belum tersedia.
       */
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

    /*
     * Cek status booking setiap 5 detik.
     * Jadi ketika admin menekan KONFIRMASI,
     * user tidak harus refresh manual.
     */
    const interval = setInterval(() => {
      getMyBookings();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // IMAGE
  // =====================================================

  const getImage = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${SERVER_URL}${image}`;
    }

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
      date: "",
      quantity: 1,
      phone: user.phone || user.no_hp || user.phoneNumber || "",
      note: "",
    });

    setShowBooking(true);
  };

  // =====================================================
  // CLOSE BOOKING
  // =====================================================

  const closeBooking = () => {
    if (bookingLoading) return;

    setShowBooking(false);
    setSelectedHotel(null);
  };

  // =====================================================
  // CHANGE BOOKING
  // =====================================================

  const handleBookingChange = (e) => {
    const { name, value } = e.target;

    setBookingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT BOOKING
  // =====================================================

  const submitBooking = async (e) => {
    e.preventDefault();

    const user = getUser();
    const userId = getUserId();

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

    if (!bookingForm.date) {
      alert("Tanggal booking wajib dipilih.");
      return;
    }

    try {
      setBookingLoading(true);

      const price = Number(selectedHotel.price || 0);

      const quantity = Number(
        bookingForm.quantity || 1
      );

      const total = price * quantity;

      /*
       * Data dikirim ke /transactions
       * karena Dashboard Admin kamu membaca:
       *
       * GET /transactions
       *
       * dan mengubah status melalui:
       *
       * PUT /transactions/:id/status
       */

      const payload = {
        userId: userId,

        userName:
          user.nama ||
          user.name ||
          user.username ||
          "User",

        userEmail:
          user.email ||
          user.Email ||
          "",

        itemName: selectedHotel.name,

        serviceName: selectedHotel.name,

        type: "hotel",

        hotelId:
          selectedHotel.id ||
          selectedHotel._id,

        petName: bookingForm.petName,

        petType:
          bookingForm.petType ||
          selectedHotel.animal ||
          "Semua Hewan",

        date: bookingForm.date,

        quantity: quantity,

        price: price,

        total: total,

        phone: bookingForm.phone,

        note: bookingForm.note,

        status: "menunggu",

        paymentStatus: "belum_bayar",
      };

      const response = await api.post(
        "/transactions",
        payload
      );

      console.log(
        "BOOKING BERHASIL:",
        response.data
      );

      alert(
        "Booking berhasil dikirim!\n\n" +
        "Silakan tunggu konfirmasi dari admin."
      );

      setShowBooking(false);

      setSelectedHotel(null);

      setBookingForm({
        petName: "",
        petType: "",
        date: "",
        quantity: 1,
        phone: "",
        note: "",
      });

      await getMyBookings();
    } catch (error) {
      console.error(
        "BOOKING ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Booking gagal dikirim. Periksa koneksi server."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // =====================================================
  // OPEN PAYMENT
  // =====================================================

  const openPayment = (booking) => {
    setSelectedBooking(booking);

    setPaymentForm({
      method: "Transfer Bank",
      proof: null,
    });

    setShowPayment(true);
  };

  // =====================================================
  // PAYMENT CHANGE
  // =====================================================

  const handlePaymentChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "proof") {
      setPaymentForm((prev) => ({
        ...prev,
        proof: files?.[0] || null,
      }));

      return;
    }

    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT PAYMENT
  // =====================================================

  const submitPayment = async (e) => {
    e.preventDefault();

    if (!selectedBooking) return;

    try {
      const formData = new FormData();

      formData.append(
        "paymentStatus",
        "menunggu_verifikasi"
      );

      formData.append(
        "paymentMethod",
        paymentForm.method
      );

      if (paymentForm.proof) {
        formData.append(
          "proof",
          paymentForm.proof
        );
      }

      /*
       * Backend admin kamu memakai:
       *
       * PUT /transactions/:id/payment
       */

      const response = await api.put(
        `/transactions/${
          selectedBooking.id ||
          selectedBooking._id
        }/payment`,
        formData
      );

      console.log(
        "PAYMENT RESPONSE:",
        response.data
      );

      alert(
        "Pembayaran berhasil dikirim.\n\n" +
        "Admin akan memverifikasi pembayaran."
      );

      setShowPayment(false);

      setSelectedBooking(null);

      await getMyBookings();
    } catch (error) {
      console.error(
        "PAYMENT ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Pembayaran gagal dikirim."
      );
    }
  };

  // =====================================================
  // OPEN REVIEW
  // =====================================================

  const openReview = (booking) => {
    setSelectedBooking(booking);

    setReviewForm({
      rating: 5,
      review: "",
    });

    setShowReview(true);
  };

  // =====================================================
  // SUBMIT REVIEW
  // =====================================================

  const submitReview = async (e) => {
    e.preventDefault();

    if (!selectedBooking) return;

    const user = getUser();
    const userId = getUserId();

    try {
      const payload = {
        userId: userId,

        userName:
          user?.nama ||
          user?.name ||
          "User",

        transactionId:
          selectedBooking.id ||
          selectedBooking._id,

        bookingId:
          selectedBooking.id ||
          selectedBooking._id,

        rating: Number(
          reviewForm.rating
        ),

        review:
          reviewForm.review,
      };

      const response = await api.post(
        "/reviews",
        payload
      );

      console.log(
        "REVIEW RESPONSE:",
        response.data
      );

      alert(
        "Review berhasil dikirim. Terima kasih."
      );

      setShowReview(false);

      setSelectedBooking(null);

      setReviewForm({
        rating: 5,
        review: "",
      });
    } catch (error) {
      console.error(
        "REVIEW ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Review gagal dikirim."
      );
    }
  };

  // =====================================================
  // FORMAT STATUS
  // =====================================================

  const getStatusLabel = (status) => {
    switch (status) {
      case "menunggu":
        return "Menunggu Konfirmasi";

      case "dikonfirmasi":
        return "Booking Dikonfirmasi";

      case "ditolak":
        return "Booking Ditolak";

      case "selesai":
        return "Selesai";

      default:
        return status || "Menunggu";
    }
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "dikonfirmasi":
        return "status-confirmed";

      case "ditolak":
        return "status-rejected";

      case "selesai":
        return "status-finished";

      default:
        return "status-pending";
    }
  };

  // =====================================================
  // PAYMENT STATUS
  // =====================================================

  const getPaymentLabel = (status) => {
    switch (status) {
      case "belum_bayar":
        return "Belum Bayar";

      case "menunggu_verifikasi":
        return "Menunggu Verifikasi";

      case "dibayar":
        return "Pembayaran Terverifikasi";

      default:
        return status || "Belum Bayar";
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="hotel-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="hotel-hero">

        <div className="hotel-hero-overlay"></div>

        <div className="hotel-hero-content">

          <span className="hotel-label">
            <FaHotel />
            PET HOTEL
          </span>

          <h1>
            Tempat Nyaman
            <br />

            <strong>
              Untuk Hewan Kesayangan
            </strong>
          </h1>

          <p>
            Tempat aman, nyaman, bersih,
            dan terpercaya untuk hewan
            kesayangan Anda.
          </p>

        </div>

      </section>


      {/* =================================================
          HOTEL CONTENT
      ================================================= */}

      <section className="hotel-content">

        <div className="hotel-heading">

          <div>

            <small>
              PET HOTEL
            </small>

            <h2>
              Pilihan Hotel Hewan
            </h2>

            <p>
              Pilih kamar pet hotel yang
              sesuai dengan kebutuhan hewan
              kesayangan Anda.
            </p>

          </div>


          <div className="hotel-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Cari hotel..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="hotel-state">

            <div className="hotel-spinner"></div>

            <p>
              Memuat data hotel...
            </p>

          </div>

        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (

          <div className="hotel-state error">

            <FaHotel />

            <p>
              {error}
            </p>

            <button
              onClick={getHotels}
            >
              Coba Lagi
            </button>

          </div>

        )}


        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          filtered.length === 0 && (

            <div className="hotel-state">

              <FaHotel />

              <h3>
                Belum ada hotel
              </h3>

              <p>
                Admin belum menambahkan
                data pet hotel.
              </p>

            </div>

          )}


        {/* =================================================
            HOTEL GRID
        ================================================= */}

        {!loading &&
          !error &&
          filtered.length > 0 && (

            <div className="hotel-grid">

              {filtered.map(
                (hotel) => (

                  <article
                    className="hotel-card"
                    key={
                      hotel.id ||
                      hotel._id
                    }
                  >

                    <div className="hotel-image">

                      {hotel.image ? (

                        <img
                          src={getImage(
                            hotel.image
                          )}
                          alt={
                            hotel.name
                          }
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />

                      ) : (

                        <div className="hotel-no-image">
                          <FaHotel />
                        </div>

                      )}

                      <span className="hotel-image-badge">
                        <FaCheckCircle />
                        Terverifikasi
                      </span>

                    </div>


                    <div className="hotel-body">

                      <span className="hotel-animal">

                        <FaPaw />

                        {hotel.animal ||
                          "Semua Hewan"}

                      </span>


                      <h3>
                        {hotel.name}
                      </h3>


                      <p>
                        {hotel.description ||
                          "Tempat nyaman dan aman untuk hewan kesayangan."}
                      </p>


                      {hotel.facilities && (

                        <div className="hotel-facilities">

                          {hotel.facilities
                            .split(",")
                            .map(
                              (
                                facility,
                                index
                              ) => (

                                <span
                                  key={
                                    index
                                  }
                                >

                                  <FaCheckCircle />

                                  {
                                    facility.trim()
                                  }

                                </span>

                              )
                            )}

                        </div>

                      )}


                      <div className="hotel-meta">

                        {hotel.capacity && (

                          <div>

                            <FaPaw />

                            <span>
                              Kapasitas
                            </span>

                            <strong>
                              {hotel.capacity}
                            </strong>

                          </div>

                        )}

                      </div>


                      {hotel.price && (

                        <div className="hotel-price">

                          <div>

                            <FaMoneyBillWave />

                            <span>
                              Mulai dari
                            </span>

                          </div>

                          <strong>
                            Rp{" "}
                            {Number(
                              hotel.price
                            ).toLocaleString(
                              "id-ID"
                            )}
                          </strong>

                          <small>
                            / malam
                          </small>

                        </div>

                      )}


                      <button
                        className="hotel-book-btn"
                        onClick={() =>
                          openBooking(
                            hotel
                          )
                        }
                      >

                        <FaHotel />

                        Booking Pet Hotel

                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}


        {/* =================================================
            MY BOOKINGS
        ================================================= */}

        <section className="my-booking-section">

          <div className="booking-section-heading">

            <div>

              <small>
                BOOKING SAYA
              </small>

              <h2>
                Riwayat Pet Hotel
              </h2>

              <p>
                Pantau status booking,
                pembayaran, dan review.
              </p>

            </div>

            <button
              className="refresh-booking"
              onClick={getMyBookings}
            >
              Refresh
            </button>

          </div>


          {bookingLoadingList ? (

            <div className="booking-loading">
              Memuat booking...
            </div>

          ) : myBookings.length === 0 ? (

            <div className="no-booking">

              <FaClipboardCheck />

              <h3>
                Belum ada booking
              </h3>

              <p>
                Booking pet hotel kamu
                akan muncul di sini.
              </p>

            </div>

          ) : (

            <div className="my-booking-grid">

              {myBookings.map(
                (booking) => (

                  <div
                    className="my-booking-card"
                    key={
                      booking.id ||
                      booking._id
                    }
                  >

                    <div className="my-booking-top">

                      <div>

                        <small>
                          BOOKING #
                          {
                            booking.id ||
                            booking._id
                          }
                        </small>

                        <h3>
                          {
                            booking.itemName ||
                            booking.serviceName ||
                            booking.name ||
                            "Pet Hotel"
                          }
                        </h3>

                      </div>

                      <span
                        className={
                          `booking-status ${getStatusClass(
                            booking.status
                          )}`
                        }
                      >
                        {
                          getStatusLabel(
                            booking.status
                          )
                        }
                      </span>

                    </div>


                    <div className="booking-user-info">

                      <div>

                        <FaUser />

                        <span>
                          Hewan
                        </span>

                        <strong>
                          {
                            booking.petName ||
                            "-"
                          }
                        </strong>

                      </div>


                      <div>

                        <FaPaw />

                        <span>
                          Jenis
                        </span>

                        <strong>
                          {
                            booking.petType ||
                            booking.type ||
                            "-"
                          }
                        </strong>

                      </div>


                      <div>

                        <FaCalendarAlt />

                        <span>
                          Tanggal
                        </span>

                        <strong>
                          {
                            booking.date ||
                            "-"
                          }
                        </strong>

                      </div>


                      <div>

                        <FaMoneyBillWave />

                        <span>
                          Total
                        </span>

                        <strong>
                          Rp{" "}
                          {Number(
                            booking.total ||
                            (
                              Number(
                                booking.price ||
                                0
                              ) *
                              Number(
                                booking.quantity ||
                                1
                              )
                            )
                          ).toLocaleString(
                            "id-ID"
                          )}
                        </strong>

                      </div>

                    </div>


                    <div className="booking-payment-status">

                      <span>
                        Pembayaran
                      </span>

                      <strong>
                        {
                          getPaymentLabel(
                            booking.paymentStatus
                          )
                        }
                      </strong>

                    </div>


                    {/* =================================
                        ACTION
                    ================================= */}

                    <div className="booking-actions">

                      {/* MENUNGGU ADMIN */}

                      {booking.status ===
                        "menunggu" && (

                        <div className="waiting-message">

                          <FaClock />

                          Menunggu konfirmasi
                          admin

                        </div>

                      )}


                      {/* DITOLAK */}

                      {booking.status ===
                        "ditolak" && (

                        <div className="rejected-message">

                          Booking ditolak
                          admin.

                        </div>

                      )}


                      {/* SUDAH DIKONFIRMASI
                          BELUM BAYAR */}

                      {booking.status ===
                        "dikonfirmasi" &&
                        booking.paymentStatus !==
                          "dibayar" &&
                        booking.paymentStatus !==
                          "menunggu_verifikasi" && (

                        <button
                          className="pay-booking-btn"
                          onClick={() =>
                            openPayment(
                              booking
                            )
                          }
                        >

                          <FaCreditCard />

                          Bayar Sekarang

                        </button>

                      )}


                      {/* PEMBAYARAN
                          MENUNGGU VERIFIKASI */}

                      {booking.paymentStatus ===
                        "menunggu_verifikasi" && (

                        <div className="waiting-payment">

                          <FaClock />

                          Pembayaran sedang
                          diverifikasi admin.

                        </div>

                      )}


                      {/* PEMBAYARAN
                          SUDAH DIBAYAR */}

                      {booking.paymentStatus ===
                        "dibayar" &&
                        booking.status !==
                          "selesai" && (

                        <div className="paid-message">

                          <FaCheckCircle />

                          Pembayaran berhasil.
                          Menunggu layanan selesai.

                        </div>

                      )}


                      {/* SELESAI
                          BISA REVIEW */}

                      {booking.status ===
                        "selesai" && (

                        <button
                          className="review-booking-btn"
                          onClick={() =>
                            openReview(
                              booking
                            )
                          }
                        >

                          <FaStar />

                          Berikan Review

                        </button>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </section>


      {/* =================================================
          BOOKING MODAL
      ================================================= */}

      {showBooking &&
        selectedHotel && (

          <div
            className="hotel-modal-overlay"
            onClick={closeBooking}
          >

            <div
              className="hotel-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="hotel-modal-header">

                <div>

                  <small>
                    BOOKING PET HOTEL
                  </small>

                  <h2>
                    {selectedHotel.name}
                  </h2>

                </div>

                <button
                  onClick={closeBooking}
                  className="modal-close"
                >
                  <FaTimes />
                </button>

              </div>


              <div className="selected-hotel-info">

                <div>

                  <FaPaw />

                  <span>
                    Hewan
                  </span>

                  <strong>
                    {
                      selectedHotel.animal ||
                      "Semua Hewan"
                    }
                  </strong>

                </div>


                <div>

                  <FaMoneyBillWave />

                  <span>
                    Harga / malam
                  </span>

                  <strong>
                    Rp{" "}
                    {Number(
                      selectedHotel.price ||
                      0
                    ).toLocaleString(
                      "id-ID"
                    )}
                  </strong>

                </div>

              </div>


              <form
                onSubmit={submitBooking}
                className="hotel-booking-form"
              >

                <div className="form-field">

                  <label>
                    Nama Hewan
                  </label>

                  <div className="input-icon">

                    <FaPaw />

                    <input
                      type="text"
                      name="petName"
                      value={
                        bookingForm.petName
                      }
                      onChange={
                        handleBookingChange
                      }
                      placeholder="Contoh: Mochi"
                      required
                    />

                  </div>

                </div>


                <div className="form-field">

                  <label>
                    Jenis Hewan
                  </label>

                  <div className="input-icon">

                    <FaPaw />

                    <input
                      type="text"
                      name="petType"
                      value={
                        bookingForm.petType
                      }
                      onChange={
                        handleBookingChange
                      }
                      placeholder="Contoh: Kucing"
                    />

                  </div>

                </div>


                <div className="form-row">

                  <div className="form-field">

                    <label>
                      Tanggal Check-in
                    </label>

                    <div className="input-icon">

                      <FaCalendarAlt />

                      <input
                        type="date"
                        name="date"
                        min={
                          new Date()
                            .toISOString()
                            .split("T")[0]
                        }
                        value={
                          bookingForm.date
                        }
                        onChange={
                          handleBookingChange
                        }
                        required
                      />

                    </div>

                  </div>


                  <div className="form-field">

                    <label>
                      Jumlah Malam
                    </label>

                    <input
                      type="number"
                      name="quantity"
                      min="1"
                      value={
                        bookingForm.quantity
                      }
                      onChange={
                        handleBookingChange
                      }
                      required
                    />

                  </div>

                </div>


                <div className="form-field">

                  <label>
                    Nomor Telepon
                  </label>

                  <div className="input-icon">

                    <FaPhone />

                    <input
                      type="text"
                      name="phone"
                      value={
                        bookingForm.phone
                      }
                      onChange={
                        handleBookingChange
                      }
                      placeholder="08xxxxxxxxxx"
                      required
                    />

                  </div>

                </div>


                <div className="form-field">

                  <label>
                    Catatan
                  </label>

                  <textarea
                    name="note"
                    value={
                      bookingForm.note
                    }
                    onChange={
                      handleBookingChange
                    }
                    placeholder="Catatan tambahan untuk pet hotel..."
                    rows="4"
                  />

                </div>


                <div className="booking-total">

                  <span>
                    Estimasi Total
                  </span>

                  <strong>
                    Rp{" "}
                    {(
                      Number(
                        selectedHotel.price ||
                        0
                      ) *
                      Number(
                        bookingForm.quantity ||
                        1
                      )
                    ).toLocaleString(
                      "id-ID"
                    )}
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
                    disabled={
                      bookingLoading
                    }
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


      {/* =================================================
          PAYMENT MODAL
      ================================================= */}

      {showPayment &&
        selectedBooking && (

          <div
            className="hotel-modal-overlay"
            onClick={() =>
              setShowPayment(false)
            }
          >

            <div
              className="hotel-modal payment-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="hotel-modal-header">

                <div>

                  <small>
                    PEMBAYARAN
                  </small>

                  <h2>
                    Bayar Booking
                  </h2>

                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setShowPayment(false)
                  }
                >
                  <FaTimes />
                </button>

              </div>


              <div className="payment-total-box">

                <span>
                  Total Pembayaran
                </span>

                <strong>
                  Rp{" "}
                  {Number(
                    selectedBooking.total ||
                    (
                      Number(
                        selectedBooking.price ||
                        0
                      ) *
                      Number(
                        selectedBooking.quantity ||
                        1
                      )
                    )
                  ).toLocaleString(
                    "id-ID"
                  )}
                </strong>

              </div>


              <form
                onSubmit={submitPayment}
                className="hotel-booking-form"
              >

                <div className="form-field">

                  <label>
                    Metode Pembayaran
                  </label>

                  <select
                    name="method"
                    value={
                      paymentForm.method
                    }
                    onChange={
                      handlePaymentChange
                    }
                  >

                    <option>
                      Transfer Bank
                    </option>

                    <option>
                      E-Wallet
                    </option>

                    <option>
                      QRIS
                    </option>

                  </select>

                </div>


                <div className="payment-bank-info">

                  <strong>
                    Rekening Pembayaran
                  </strong>

                  <p>
                    Bank BCA
                  </p>

                  <p>
                    1234567890
                  </p>

                  <p>
                    a.n. PetCare Hub Zalta
                  </p>

                </div>


                <div className="form-field">

                  <label>
                    Bukti Pembayaran
                  </label>

                  <input
                    type="file"
                    name="proof"
                    accept="image/*"
                    onChange={
                      handlePaymentChange
                    }
                    required
                  />

                  <small>
                    Upload bukti transfer
                    dalam format JPG, PNG,
                    atau WEBP.
                  </small>

                </div>


                <div className="modal-actions">

                  <button
                    type="button"
                    className="modal-cancel"
                    onClick={() =>
                      setShowPayment(false)
                    }
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="modal-submit"
                  >

                    <FaCreditCard />

                    Kirim Pembayaran

                  </button>

                </div>

              </form>

            </div>

          </div>

        )}


      {/* =================================================
          REVIEW MODAL
      ================================================= */}

      {showReview &&
        selectedBooking && (

          <div
            className="hotel-modal-overlay"
            onClick={() =>
              setShowReview(false)
            }
          >

            <div
              className="hotel-modal review-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="hotel-modal-header">

                <div>

                  <small>
                    REVIEW LAYANAN
                  </small>

                  <h2>
                    Bagaimana pengalamanmu?
                  </h2>

                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setShowReview(false)
                  }
                >
                  <FaTimes />
                </button>

              </div>


              <form
                onSubmit={submitReview}
                className="hotel-booking-form"
              >

                <div className="rating-select">

                  <label>
                    Rating
                  </label>

                  <div className="stars">

                    {[1, 2, 3, 4, 5].map(
                      (star) => (

                        <button
                          type="button"
                          key={star}
                          className={
                            star <=
                            reviewForm.rating
                              ? "star active"
                              : "star"
                          }
                          onClick={() =>
                            setReviewForm(
                              (prev) => ({
                                ...prev,
                                rating:
                                  star,
                              })
                            )
                          }
                        >
                          <FaStar />
                        </button>

                      )
                    )}

                  </div>

                </div>


                <div className="form-field">

                  <label>
                    Review
                  </label>

                  <textarea
                    value={
                      reviewForm.review
                    }
                    onChange={(e) =>
                      setReviewForm(
                        (prev) => ({
                          ...prev,
                          review:
                            e.target.value,
                        })
                      )
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
                    onClick={() =>
                      setShowReview(false)
                    }
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="modal-submit"
                  >

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