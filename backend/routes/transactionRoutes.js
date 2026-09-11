const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// 1. GET Semua Transaksi
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

// 2. GET Satu Transaksi
router.get("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaksi tidak ditemukan" });
    }
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. POST Buat Transaksi Baru
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
    } = req.body;

    if (!items || !total || !address || !phone) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap: items, total, address, phone wajib diisi",
      });
    }

    // 🔥 Gunakan default yang aman, abaikan status/paymentStatus dari client
    const newTransaction = await Transaction.create({
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
      itemName: itemName || (Array.isArray(items) && items.length > 0 ? items[0].name : "Pesanan"),
      type: type || "Produk",
      date: date || new Date().toISOString().split("T")[0],
      time: time || new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      quantity: quantity || (Array.isArray(items) ? items.reduce((sum, i) => sum + (i.quantity || 1), 0) : 1),
      price: price || total,
    });

    res.status(201).json({ success: true, data: newTransaction });
  } catch (error) {
    console.error("POST /transactions error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper Penyelaras Status Database
const normalizeStatus = (inputStatus) => {
  if (!inputStatus) return "menunggu";
  const str = inputStatus.toString().toLowerCase();
  
  if (str.includes("batal")) return "dibatalkan";
  if (str.includes("kemas") || str.includes("konfirmasi") || str.includes("proses")) return "dikemas";
  if (str.includes("kirim")) return "dikirim";
  if (str.includes("selesai") || str.includes("terima") || str.includes("paid")) return "selesai";
  if (str.includes("tolak")) return "ditolak";
  return "menunggu";
};

// 4. PUT Update Status Transaksi
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaksi tidak ditemukan" });
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

// 5. PUT Endpoint alternatif Update status/payment (generic)
router.put("/:id", async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaksi tidak ditemukan" });
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

    transaction.updatedAt = new Date();
    await transaction.save();

    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. DELETE Hapus 1 Pesanan
router.delete("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaksi tidak ditemukan" });
    }
    await transaction.destroy();
    res.json({ success: true, message: "Transaksi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 7. DELETE HAPUS SEMUA PESANAN (Reset Data Dummy)
router.delete("/reset/all", async (req, res) => {
  try {
    await Transaction.destroy({ where: {}, truncate: true });
    res.json({ success: true, message: "Semua data pesanan berhasil dibersihkan!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;