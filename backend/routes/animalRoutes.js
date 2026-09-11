const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const animalController = require("../controllers/animalController");

// ======================================================
// KONFIGURASI MULTER (PENYIMPANAN GAMBAR)
// ======================================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Menyimpan file ke folder 'uploads/' yang diset statis di app.js
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Membuat nama file unik berdasarkan timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter jenis file (hanya gambar)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diperbolehkan!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5MB per file
});

// ======================================================
// ROUTE MAPPING
// ======================================================
// GET: Ambil semua data hewan
router.get("/", animalController.getAnimals);

// POST: Tambah data hewan baru (upload.single('image') memproses field 'image')
router.post("/", upload.single("image"), animalController.createAnimal);

// PUT: Edit data hewan berdasarkan ID
router.put("/:id", upload.single("image"), animalController.updateAnimal);

// DELETE: Hapus data hewan berdasarkan ID
router.delete("/:id", animalController.deleteAnimal);

module.exports = router;