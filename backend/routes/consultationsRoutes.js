const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Consultation = require("../models/Consultation");
const MedicalRecord = require("../models/MedicalRecord");

// =====================================================
// 1. GET Semua Konsultasi (Admin)
// =====================================================
router.get("/", async (req, res) => {
  try {
    const data = await Consultation.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, data });
  } catch (error) {
    console.error("GET /consultations error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================================
// 2. GET Konsultasi by userId / email
// =====================================================
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { email } = req.query;

    const conditions = [];
    if (userId && userId !== "0" && userId !== "undefined") {
      const idNum = Number(userId);
      if (!isNaN(idNum)) conditions.push({ userId: idNum });
    }
    if (email && email.trim() !== "") {
      conditions.push({ userEmail: email });
    }

    if (conditions.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "userId atau email wajib" });
    }

    const data = await Consultation.findAll({
      where: { [Op.or]: conditions },
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error("GET /consultations/user error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================================
// 3. POST Konsultasi Baru
// =====================================================
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      userPhone,
      doctorId,
      doctorName,
      doctorSpecialization,
      complaint,
    } = req.body;

    if (!complaint || complaint.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Keluhan wajib diisi",
      });
    }

    const newConsultation = await Consultation.create({
      userId: userId || null,
      userName: userName || "User",
      userEmail: userEmail || "",
      userPhone: userPhone || "",
      doctorId: doctorId || null,
      doctorName: doctorName || "",
      doctorSpecialization: doctorSpecialization || "",
      complaint,
      status: "menunggu",
    });

    res.status(201).json({ success: true, data: newConsultation });
  } catch (error) {
    console.error("POST /consultations error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================================
// 4. PUT Balas Konsultasi — AUTO CREATE MEDICAL RECORD
// =====================================================
router.put("/:id/reply", async (req, res) => {
  try {
    const { reply } = req.body;
    const consultation = await Consultation.findByPk(req.params.id);

    if (!consultation) {
      return res
        .status(404)
        .json({ success: false, message: "Konsultasi tidak ditemukan" });
    }

    // Update balasan
    consultation.reply = reply || "";
    consultation.status = "dijawab";
    consultation.updatedAt = new Date();
    await consultation.save();

    // =====================================================
    // AUTO CREATE MEDICAL RECORD
    // =====================================================
    try {
      // Parse keluhan untuk ambil nama hewan
      let petName = "-";
      let actualComplaint = consultation.complaint;

      const petMatch = consultation.complaint.match(/\[Hewan:\s*([^\]]+)\]/);
      if (petMatch) {
        petName = petMatch[1].trim();
        actualComplaint = consultation.complaint
          .replace(/\[Hewan:[^\]]+\]\s*/g, "")
          .trim();
      }

      // Cek duplikat — jangan create kalau sudah ada
      const existing = await MedicalRecord.findOne({
        where: {
          ownerName: consultation.userName,
          complaint: actualComplaint,
        },
      });

      if (!existing) {
        await MedicalRecord.create({
          petName: petName,
          petType: consultation.doctorSpecialization || "Hewan",
          ownerName: consultation.userName || "-",
          ownerPhone: consultation.userPhone || "-",
          ownerEmail: consultation.userEmail || "",
          doctorName: consultation.doctorName || "-",
          visitDate: new Date().toISOString().split("T")[0],
          complaint: actualComplaint,
          diagnosis: reply || "-",
          treatment: reply || "-",
          notes: `Konsultasi online #${consultation.id}`,
        });

        console.log(
          "✅ Auto-create MedicalRecord dari konsultasi #",
          consultation.id
        );
      }
    } catch (err) {
      console.error("⚠️ Gagal auto-create MedicalRecord:", err.message);
      // Tetap sukses walau auto-create gagal
    }

    res.json({ success: true, data: consultation });
  } catch (error) {
    console.error("PUT reply error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================================
// 5. PUT Update Status
// =====================================================
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const consultation = await Consultation.findByPk(req.params.id);

    if (!consultation) {
      return res
        .status(404)
        .json({ success: false, message: "Konsultasi tidak ditemukan" });
    }

    if (status) consultation.status = status;
    consultation.updatedAt = new Date();
    await consultation.save();

    res.json({ success: true, data: consultation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================================
// 6. DELETE
// =====================================================
router.delete("/:id", async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);
    if (!consultation) {
      return res
        .status(404)
        .json({ success: false, message: "Konsultasi tidak ditemukan" });
    }
    await consultation.destroy();
    res.json({ success: true, message: "Konsultasi dihapus" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;