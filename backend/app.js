// ======================================================
// LOAD ENVIRONMENT
// ======================================================
const dotenv = require("dotenv");
dotenv.config();

// ======================================================
// IMPORT PACKAGE
// ======================================================
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// ======================================================
// DATABASE
// ======================================================
const sequelize = require("./config/database");

// ======================================================
// ROUTES
// ======================================================
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const animalRoutes = require("./routes/animalRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adoptionRoutes = require("./routes/adoptionRoutes");
const consultationsRoutes = require("./routes/consultationsRoutes");
const medicalRecordsRoutes = require("./routes/medicalRecordsRoutes"); // <-- BARU

// ======================================================
// APP
// ======================================================
const app = express();

// ======================================================
// FOLDER UPLOADS
// ======================================================
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ======================================================
// STATIC UPLOADS
// ======================================================
app.use("/uploads", express.static(uploadsDir));

// ======================================================
// CORS
// ======================================================
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ======================================================
// BODY PARSER
// ======================================================
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// ======================================================
// LOGGER
// ======================================================
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ======================================================
// AUTH
// ======================================================
app.use("/api/auth", authRoutes);

// ======================================================
// BOOKING
// ======================================================
// PENTING:
// Booking harus dipasang SEBELUM app.use("/api", adminRoutes)
// Karena adminRoutes pakai prefix /api.
// ======================================================
app.use("/api/bookings", bookingRoutes);

// ======================================================
// REVIEWS
// ======================================================
app.use("/api/reviews", reviewRoutes);

// ======================================================
// CONSULTATIONS (KONSULTASI DOKTER)
// ======================================================
app.use("/api/consultations", consultationsRoutes);

// ======================================================
// MEDICAL RECORDS (RIWAYAT PEMERIKSAAN)  <-- BARU
// ======================================================
app.use("/api/medical-records", medicalRecordsRoutes);

// ======================================================
// ADMIN CRUD
// ======================================================
app.use("/api", adminRoutes);

// ======================================================
// TRANSACTIONS
// ======================================================
app.use("/api/transactions", transactionRoutes);

// ======================================================
// ANIMALS
// ======================================================
app.use("/api/animals", animalRoutes);

// ======================================================
// ADOPTIONS
// ======================================================
app.use("/api/adoption-requests", adoptionRoutes);

// ======================================================
// TEST ROOT
// ======================================================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend PetCare Hub Zalta berjalan",
    server: "http://localhost:5000",
    api: "http://localhost:5000/api",
  });
});

// ======================================================
// TEST API
// ======================================================
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API PetCare aktif",
  });
});

// ======================================================
// TEST DATABASE
// ======================================================
app.get("/api/db-test", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      success: true,
      message: "Database berhasil terhubung",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ======================================================
// 404
// ======================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`,
  });
});

// ======================================================
// ERROR HANDLER
// ======================================================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Terjadi kesalahan server",
  });
});

// ======================================================
// START SERVER
// ======================================================
const startServer = async () => {
  try {
    // TEST DATABASE
    await sequelize.authenticate();
    console.log("================================");
    console.log("DATABASE CONNECTED");
    console.log("================================");

    // SYNC DATABASE
    await sequelize.sync({ alter: true });
    console.log("Semua model berhasil disinkronkan dan kolom database diperbarui!");

    // CHECK JWT SECRET
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET belum ada di .env");
      process.exit(1);
    }

    // PORT
    const PORT = process.env.PORT || 5000;

    // START SERVER
    app.listen(PORT, () => {
      console.log("================================");
      console.log("PETCARE HUB ZALTA");
      console.log(`Server : http://localhost:${PORT}`);
      console.log(`API    : http://localhost:${PORT}/api`);
      console.log(`Booking: http://localhost:${PORT}/api/bookings`);
      console.log(`Transaksi: http://localhost:${PORT}/api/transactions`);
      console.log(`Konsultasi: http://localhost:${PORT}/api/consultations`);
      console.log(`Riwayat Berobat: http://localhost:${PORT}/api/medical-records`);
      console.log(`Uploads: http://localhost:${PORT}/uploads`);
      console.log(`Reviews: http://localhost:${PORT}/api/reviews`);
      console.log("================================");
    });
  } catch (error) {
    console.error("GAGAL MENJALANKAN SERVER");
    console.error(error);
    process.exit(1);
  }
};

// RUN SERVER
startServer();

// ======================================================
// UNHANDLED REJECTION
// ======================================================
process.on("unhandledRejection", (error) => {
  console.error("UNHANDLED REJECTION:", error);
});

// ======================================================
// UNCAUGHT EXCEPTION
// ======================================================
process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION:", error);
});