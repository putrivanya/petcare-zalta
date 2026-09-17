const express = require("express");
const router = express.Router();
const { Op } = require("sequelize"); // <-- WAJIB untuk OR query
const Transaction = require("../models/Transaction");

// =====================================================
// 1. GET Semua Transaksi
// =====================================================
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("GET /transactions error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================================
// 1b. GET Transaksi by userId / email  <-- BARU
// HARUS DI ATAS "/:id" biar tidak ke-shadow
// =====================================================
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { email } = req.query;

    console.log("🔍 GET /transactions/user:", { userId, email });

    const conditions = [];

    if (
      userId &&
      userId !== "0" &&
      userId !== "undefined" &&
      userId !== "null"
    ) {
      const idNum = Number(userId);
      if (!isNaN(idNum)) conditions.push({ userId: idNum });
      conditions.push({ userId: userId });
    }

    if (email && email.trim() !== "") {
      conditions.push({ userEmail: email });
    }

    if (conditions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "userId atau email wajib diberikan",
      });
    }

    const transactions = await Transaction.findAll({
      where: { [Op.or]: conditions },
      order: [["createdAt", "DESC"]],
    });

    console.log("✅ Ditemukan", transactions.length, "transaksi");

    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("GET /transactions/user/:userId error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================================
// 2. GET Satu Transaksi
// =====================================================
router.get("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaksi tidak ditemukan" });
    }
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================================
// 3. POST Buat Transaksi Baru
// =====================================================
router.post("/", async (req, res) => {
  try {
    const {
      items,
      total,
      address,
      city,
      postalCode,
      phone,
      paymentMethod,
      notes,
      userName,
      userEmail,
      userPhone,
      itemName,
      type,
      date,
      time,
      quantity,
      price,
      courier,
      trackingNumber,
      // TAMBAHAN hotel
      userId,
      hotelId,
      petName,
      petType,
      checkIn,
      checkOut,
    } = req.body;

    console.log("📥 POST /transactions:", {
      userId,
      userEmail,
      total,
      address,
      phone,
      checkIn,
      checkOut,
    });

    if (!items || !total || !address || !phone) {
      return res.status(400).json({
        success: false,
        message:
          "Data tidak lengkap: items, total, address, phone wajib diisi",
      });
    }

    const newTransaction = await Transaction.create({
      userId: userId || null,
      items: typeof items === "string" ? items : JSON.stringify(items),
      total,
      address,
      city: city || "",
      postalCode: postalCode || "",
      phone,
      paymentMethod: paymentMethod || "COD",
      notes: notes || "",
      status: "menunggu",
      paymentStatus: "belum_bayar",
      userName: userName || "User",
      userEmail: userEmail || "",
      userPhone: userPhone || phone,
      itemName:
        itemName ||
        (Array.isArray(items) && items.length > 0
          ? items[0].name
          : "Pesanan"),
      type: type || "hotel",
      date: date || new Date().toISOString().split("T")[0],
      time:
        time ||
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      quantity:
        quantity ||
        (Array.isArray(items)
          ? items.reduce((sum, i) => sum + (i.quantity || 1), 0)
          : 1),
      price: price || total,
      courier: courier || "",
      trackingNumber: trackingNumber || "",
      hotelId: hotelId || null,
      petName: petName || "",
      petType: petType || "",
      checkIn: checkIn || null,
      checkOut: checkOut || null,
    });

    console.log("✅ Transaksi dibuat ID:", newTransaction.id);

    res.status(201).json({ success: true, data: newTransaction });
  } catch (error) {
    console.error("POST /transactions error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================================
// Helper Penyelaras Status
// =====================================================
const normalizeStatus = (inputStatus) => {
  if (!inputStatus) return "menunggu";
  const str = inputStatus.toString().toLowerCase();

  if (str.includes("batal")) return "dibatalkan";
  if (
    str.includes("kemas") ||
    str.includes("konfirmasi") ||
    str.includes("proses")
  )
    return "dikemas";
  if (str.includes("kirim")) return "dikirim";
  if (
    str.includes("selesai") ||
    str.includes("terima") ||
    str.includes("paid")
  )
    return "selesai";
  if (str.includes("tolak")) return "ditolak";
  return "menunggu";
};

// =====================================================
// 4. PUT Update Status
// =====================================================
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaksi tidak ditemukan" });
    }

    const newStatus = normalizeStatus(status);
    transaction.status = newStatus;

    if (newStatus === "selesai") {
      transaction.paymentStatus = "dibayar";
    }

    transaction.updatedAt = new Date();
    await transaction.save();

    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================================
// 5. PUT Generic
// =====================================================
router.put("/:id", async (req, res) => {
  try {
    const { status, paymentStatus, courier, trackingNumber, notes } =
      req.body;
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaksi tidak ditemukan" });
    }

    if (status) {
      const newStatus = normalizeStatus(status);
      transaction.status = newStatus;
      if (newStatus === "selesai") {
        transaction.paymentStatus = "dibayar";
      }
    }

    if (paymentStatus) {
      transaction.paymentStatus = paymentStatus;
    }

    if (courier !== undefined) {
      transaction.courier = courier;
      console.log("📦 Kurir diupdate jadi:", courier);
    }
    if (trackingNumber !== undefined) {
      transaction.trackingNumber = trackingNumber;
      console.log("📋 Resi diupdate jadi:", trackingNumber);
    }
    if (notes !== undefined) {
      transaction.notes = notes;
    }

    transaction.updatedAt = new Date();
    await transaction.save();

    console.log("✅ Transaksi berhasil diupdate:", {
      id: transaction.id,
      status: transaction.status,
      courier: transaction.courier,
      trackingNumber: transaction.trackingNumber,
    });

    res.json({ success: true, data: transaction });
  } catch (error) {
    console.error("PUT /transactions/:id error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================================
// 6. DELETE Hapus 1 Pesanan
// =====================================================
router.delete("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaksi tidak ditemukan" });
    }
    await transaction.destroy();
    res.json({ success: true, message: "Transaksi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================================
// 7. DELETE Reset Semua
// =====================================================
router.delete("/reset/all", async (req, res) => {
  try {
    await Transaction.destroy({ where: {}, truncate: true });
    res.json({
      success: true,
      message: "Semua data pesanan berhasil dibersihkan!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;