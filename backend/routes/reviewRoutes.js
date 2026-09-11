const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Transaction = require("../models/Transaction");

// ======================================================
// GET SEMUA ULASAN
// GET /api/reviews
// ======================================================
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================================================
// CEK KELAYAKAN REVIEW UNTUK SATU TRANSAKSI
// GET /api/reviews/eligibility/:transactionId
//
// Dipakai FRONTEND sebelum menampilkan form, supaya tahu
// harus munculkan form "review produk" (rating + komentar)
// atau cuma "rating toko" (bintang saja).
// ======================================================
router.get("/eligibility/:transactionId", async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan",
      });
    }

    if (transaction.isReviewed) {
      return res.json({
        success: true,
        canReview: false,
        message: "Transaksi ini sudah direview",
      });
    }

    const buyerKey = transaction.userEmail || transaction.userPhone;

    const previousReview = buyerKey
      ? await Review.findOne({ where: { buyerKey } })
      : null;

    const isFirstTimeBuyer = !previousReview;

    res.json({
      success: true,
      canReview: true,
      type: isFirstTimeBuyer ? "product" : "store",
      isFirstTimeBuyer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================================================
// POST - KIRIM ULASAN
// POST /api/reviews
//
// Pembelian PERTAMA (buyerKey belum pernah muncul di tabel
// Review)  -> type "product", wajib isi komentar/opini.
//
// Pembelian BERIKUTNYA (buyerKey sudah pernah review)
// -> type "store", komentar diabaikan, cuma rating toko
// yang disimpan.
// ======================================================
router.post("/", async (req, res) => {
  try {
    const { transactionId, userName, rating, comment } = req.body;

    if (!transactionId || !rating) {
      return res.status(400).json({
        success: false,
        message: "transactionId dan rating wajib diisi!",
      });
    }

    const ratingNumber = Number(rating);

    if (!Number.isInteger(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating harus berupa angka 1 - 5",
      });
    }

    // ==================================================
    // CARI TRANSAKSI
    // ==================================================
    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan",
      });
    }

    if (transaction.isReviewed) {
      return res.status(400).json({
        success: false,
        message: "Transaksi ini sudah pernah direview",
      });
    }

    // ==================================================
    // TENTUKAN PENGENAL PEMBELI (email diutamakan, fallback telepon)
    // ==================================================
    const buyerKey = transaction.userEmail || transaction.userPhone;

    if (!buyerKey) {
      return res.status(400).json({
        success: false,
        message:
          "Transaksi ini tidak punya email/nomor telepon untuk verifikasi pembeli",
      });
    }

    // ==================================================
    // CEK APAKAH INI PEMBELIAN PERTAMA USER INI
    // ==================================================
    const previousReview = await Review.findOne({ where: { buyerKey } });

    const isFirstTimeBuyer = !previousReview;
    const type = isFirstTimeBuyer ? "product" : "store";

    if (isFirstTimeBuyer && !comment) {
      return res.status(400).json({
        success: false,
        message: "Komentar/opini wajib diisi untuk review pertama kamu",
      });
    }

    // ==================================================
    // SIMPAN REVIEW
    // ==================================================
    const newReview = await Review.create({
      transactionId,
      buyerKey,
      userName: userName || transaction.userName || "Pelanggan",
      rating: ratingNumber,
      comment: type === "product" ? comment : null,
      type,
    });

    // ==================================================
    // TANDAI TRANSAKSI SUDAH DIREVIEW
    // ==================================================
    transaction.isReviewed = true;
    await transaction.save();

    res.status(201).json({
      success: true,
      message:
        type === "product"
          ? "Review produk berhasil dikirim, terima kasih!"
          : "Rating toko berhasil dikirim, terima kasih!",
      isFirstTimeBuyer,
      data: newReview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;