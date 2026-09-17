const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
const MedicalRecord = require("../models/MedicalRecord");

// =====================================================
// SETUP MULTER — UPLOAD GAMBAR
// =====================================================
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "medical-" + unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("File harus berupa gambar"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

// =====================================================
// 1. GET Semua Medical Records (Admin)
// =====================================================
router.get("/", async (req, res) => {
  try {
    const data = await MedicalRecord.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, data });
  } catch (error) {
    console.error("GET /medical-records error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================================
// 2. GET Medical Records by user (email / name)
// =====================================================
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { email, name } = req.query;

    const conditions = [];

    if (email && email.trim() !== "") {
      conditions.push({ ownerEmail: email });
    }
    if (name && name.trim() !== "") {
      conditions.push({ ownerName: name });
    }

    if (conditions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "email atau name wajib diberikan",
      });
    }

    const data = await MedicalRecord.findAll({
      where: { [Op.or]: conditions },
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error("GET /medical-records/user error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================================
// 3. GET Satu Medical Record
// =====================================================
router.get("/:id", async (req, res) => {
  try {
    const record = await MedicalRecord.findByPk(req.params.id);
    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }
    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================================
// 4. POST Buat Medical Record Baru
//    PENTING: pakai upload.single("image")
// =====================================================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("📥 POST /medical-records body:", req.body);
    console.log("📥 POST /medical-records file:", req.file);

    // req.body AMAN sekarang karena multer sudah parse
    const body = req.body || {};

    const petName = body.petName || "";
    const petType = body.petType || "-";
    const ownerName = body.ownerName || "";
    const ownerPhone = body.ownerPhone || "-";
    const ownerEmail = body.ownerEmail || "";
    const doctorName = body.doctorName || "";
    const visitDate = body.visitDate || new Date().toISOString().split("T")[0];
    const complaint = body.complaint || "-";
    const diagnosis = body.diagnosis || "-";
    const treatment = body.treatment || "-";
    const notes = body.notes || "";
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Validasi wajib
    if (!petName || petName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Nama Hewan wajib diisi",
      });
    }
    if (!ownerName || ownerName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Nama Pemilik wajib diisi",
      });
    }
    if (!doctorName || doctorName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Dokter Pemeriksa wajib diisi",
      });
    }

    const newRecord = await MedicalRecord.create({
      petName,
      petType,
      ownerName,
      ownerPhone,
      ownerEmail,
      doctorName,
      visitDate,
      complaint,
      diagnosis,
      treatment,
      notes,
      image,
    });

    console.log("✅ MedicalRecord dibuat ID:", newRecord.id);

    res.status(201).json({ success: true, data: newRecord });
  } catch (error) {
    console.error("POST /medical-records error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================================
// 5. PUT Update Medical Record
// =====================================================
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const record = await MedicalRecord.findByPk(req.params.id);
    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }

    const body = req.body || {};

    const allowedFields = [
      "petName",
      "petType",
      "ownerName",
      "ownerPhone",
      "ownerEmail",
      "doctorName",
      "visitDate",
      "complaint",
      "diagnosis",
      "treatment",
      "notes",
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        record[field] = body[field];
      }
    });

    // Kalau ada upload gambar baru
    if (req.file) {
      record.image = `/uploads/${req.file.filename}`;
    }

    record.updatedAt = new Date();
    await record.save();

    res.json({ success: true, data: record });
  } catch (error) {
    console.error("PUT /medical-records error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================================
// 6. DELETE Medical Record
// =====================================================
router.delete("/:id", async (req, res) => {
  try {
    const record = await MedicalRecord.findByPk(req.params.id);
    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }
    await record.destroy();
    res.json({ success: true, message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;