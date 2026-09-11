const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { authenticateToken } = require("../middleware/auth");
const { isAdmin } = require("../middleware/roles");

// ============================================
// GET all orders (admin)
// ============================================
router.get("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET orders by user
// ============================================
router.get("/user", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET order detail by ID
// ============================================
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id },
    });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order tidak ditemukan" });
    }
    // Check authorization: user boleh lihat milik sendiri, admin boleh semua
    if (req.user.role !== "admin" && order.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Tidak diizinkan" });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// CREATE new order (user)
// ============================================
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { items, total, address, city, postalCode, phone, paymentMethod, notes } = req.body;

    if (!items || !total || !address || !city || !phone) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap: items, total, address, city, phone wajib diisi",
      });
    }

    const newOrder = await Order.create({
      userId: req.user.id,
      items,
      total,
      address,
      city,
      postalCode: postalCode || "",
      phone,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: "belum_bayar",
      status: "menunggu",
      notes: notes || "",
    });

    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// UPDATE order status (admin)
// ============================================
router.put("/:id/status", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["menunggu", "dikemas", "dikirim", "selesai", "ditolak"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status tidak valid. Pilih: " + validStatuses.join(", "),
      });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order tidak ditemukan" });
    }

    order.status = status;
    order.updatedAt = new Date();
    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// UPDATE payment status (admin)
// ============================================
router.put("/:id/payment", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const validPayment = ["belum_bayar", "menunggu_verifikasi", "dibayar"];
    if (!validPayment.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Payment status tidak valid. Pilih: " + validPayment.join(", "),
      });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order tidak ditemukan" });
    }

    order.paymentStatus = paymentStatus;
    order.updatedAt = new Date();
    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// DELETE order (admin)
// ============================================
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order tidak ditemukan" });
    }
    await order.destroy();
    res.json({ success: true, message: "Order berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;