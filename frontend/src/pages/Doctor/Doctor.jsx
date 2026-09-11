import React, {
  useEffect,
  useState,
} from "react";

import {
  FaStethoscope,
  FaPhone,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaSearch,
  FaUserMd,
  FaWhatsapp,
  FaArrowLeft,
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
  // LOAD DATA
  // ====================================================

  useEffect(() => {
    getDoctors();
  }, []);

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
    if (image.startsWith("/")) {
      return `${IMAGE_URL}${image}`;
    }
    return `${IMAGE_URL}/${image}`;
  };

  // ====================================================
  // FORMAT PRICE
  // ====================================================

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === "") return "-";
    return Number(price).toLocaleString("id-ID");
  };

  // ====================================================
  // WHATSAPP
  // ====================================================

  const handleConsultation = (doctor) => {
    if (!doctor.phone) {
      alert("Nomor WhatsApp dokter belum tersedia.");
      return;
    }

    let phone = String(doctor.phone).replace(/\D/g, "");
    if (phone.startsWith("0")) {
      phone = "62" + phone.substring(1);
    }
    if (!phone.startsWith("62")) {
      phone = "62" + phone;
    }

    const message = encodeURIComponent(
      `Halo Dokter ${doctor.name || ""},

Saya ingin melakukan konsultasi mengenai hewan peliharaan saya melalui PetCare Hub Zalta.

Terima kasih.`
    );

    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // ====================================================
  // TOMBOL KEMBALI
  // ====================================================
  const goBack = () => {
    navigate(-1);
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="doctor-page">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="doctor-hero">

        <div className="doctor-hero-content">

          {/* TOMBOL KEMBALI */}
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
            Temukan dokter hewan terbaik
            yang tersedia di PetCare Hub
            Zalta.
          </p>

        </div>

      </section>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <section className="doctor-content">

        {/* ==================================================
            HEADING
        ================================================== */}

        <div className="doctor-heading">

          <div>

            <span className="section-small">
              LAYANAN DOKTER
            </span>

            <h2>
              Pilih Dokter Hewan
            </h2>

            <p>
              Informasi dokter ditampilkan
              langsung dari data yang
              dikelola admin.
            </p>

          </div>

          {/* ==================================================
              SEARCH
          ================================================== */}

          <div className="doctor-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Cari dokter..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (

          <div className="doctor-state">

            <div className="loading-spinner"></div>

            <p>
              Memuat data dokter...
            </p>

          </div>

        )}

        {/* ==================================================
            ERROR
        ================================================== */}

        {!loading && error && (

          <div className="doctor-state error">

            <FaStethoscope />

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={getDoctors}
            >
              Coba Lagi
            </button>

          </div>

        )}

        {/* ==================================================
            EMPTY
        ================================================== */}

        {!loading &&
          !error &&
          filteredDoctors.length === 0 && (

            <div className="doctor-state">

              <FaUserMd />

              <h3>
                Dokter belum tersedia
              </h3>

              <p>
                {search
                  ? `Dokter dengan kata "${search}" tidak ditemukan.`
                  : "Belum ada data dokter yang ditambahkan oleh admin."}
              </p>

            </div>

          )}

        {/* ==================================================
            DOCTOR GRID
        ================================================== */}

        {!loading &&
          !error &&
          filteredDoctors.length > 0 && (

            <div className="doctor-grid">

              {filteredDoctors.map((doctor) => (

                <article
                  className="doctor-card"
                  key={doctor.id || doctor._id}
                >

                  {/* ==================================================
                      IMAGE
                  ================================================== */}

                  <div className="doctor-image">

                    {doctor.image ? (

                      <img
                        src={getImage(doctor.image)}
                        alt={doctor.name || "Dokter Hewan"}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";

                          const parent =
                            e.currentTarget.parentElement;

                          if (
                            parent &&
                            !parent.querySelector(
                              ".doctor-image-fallback"
                            )
                          ) {
                            const fallback =
                              document.createElement("div");

                            fallback.className =
                              "doctor-image-fallback";

                            fallback.innerHTML =
                              `<span>👨‍⚕️</span>`;

                            parent.appendChild(fallback);
                          }
                        }}
                      />

                    ) : (

                      <div className="doctor-no-image">
                        <FaUserMd />
                      </div>

                    )}

                  </div>

                  {/* ==================================================
                      BODY
                  ================================================== */}

                  <div className="doctor-card-body">

                    {/* SPECIALIZATION */}

                    <span className="doctor-specialization">

                      <FaStethoscope />

                      {doctor.specialization ||
                        "Dokter Hewan"}

                    </span>

                    {/* NAME */}

                    <h3>
                      {doctor.name ||
                        "Dokter Hewan"}
                    </h3>

                    {/* DESCRIPTION */}

                    {doctor.description && (

                      <p className="doctor-description">

                        {doctor.description}

                      </p>

                    )}

                    {/* ==================================================
                        INFORMATION
                    ================================================== */}

                    <div className="doctor-info">

                      {/* PRICE */}

                      {doctor.price !==
                        undefined &&
                        doctor.price !==
                        null &&
                        doctor.price !==
                        "" && (

                          <div>

                            <FaMoneyBillWave />

                            <span>
                              Rp{" "}
                              {formatPrice(doctor.price)}
                            </span>

                          </div>

                        )}

                      {/* SCHEDULE */}

                      {doctor.schedule && (

                        <div>

                          <FaCalendarAlt />

                          <span>
                            {doctor.schedule}
                          </span>

                        </div>

                      )}

                      {/* PHONE */}

                      {doctor.phone && (

                        <div>

                          <FaPhone />

                          <span>
                            {doctor.phone}
                          </span>

                        </div>

                      )}

                    </div>

                    {/* ==================================================
                        CONSULTATION BUTTON
                    ================================================== */}

                    <button
                      type="button"
                      className="doctor-button"
                      onClick={() =>
                        handleConsultation(doctor)
                      }
                    >

                      <FaWhatsapp />

                      <span>
                        Konsultasi Sekarang
                      </span>

                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

      </section>

    </div>
  );
};

export default Doctor;