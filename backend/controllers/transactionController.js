const Transaction = require("../models/Transaction");

// =====================================================
// USER - BUAT TRANSAKSI / BOOKING
// =====================================================
exports.createTransaction = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      type,
      itemId,
      itemName,
      quantity,
      price,
      date,
      note,
    } = req.body;

    // Validasi wajib
    if (!userName || !userEmail || !type || !itemName) {
      return res.status(400).json({
        success: false,
        message: "Data transaksi belum lengkap",
      });
    }

    // Validasi type
    const allowedTypes = [
      "produk",
      "grooming",
      "dokter",
      "hotel",
      "adopsi",
    ];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Jenis transaksi tidak valid",
      });
    }

    // Buat transaksi
    const transaction = await Transaction.create({
      userId: userId || null,
      userName: userName,
      userEmail: userEmail,
      type: type,
      itemId: itemId || null,
      itemName: itemName,
      quantity: Number(quantity) || 1,
      price: Number(price) || 0,
      date: date || null,
      note: note || null,

      // Awalnya menunggu konfirmasi admin
      status: "menunggu",

      // Belum melakukan pembayaran
      paymentStatus: "belum_bayar",
    });

    return res.status(201).json({
      success: true,
      message:
        "Booking berhasil dibuat dan sedang menunggu konfirmasi admin",
      data: transaction,
    });
  } catch (error) {
    console.error("CREATE TRANSACTION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal membuat transaksi",
      error: error.message,
    });
  }
};

// =====================================================
// ADMIN - AMBIL SEMUA TRANSAKSI
// =====================================================
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("GET TRANSACTIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil transaksi",
      error: error.message,
    });
  }
};

// =====================================================
// USER - AMBIL TRANSAKSI BERDASARKAN EMAIL
// =====================================================
exports.getUserTransactions = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email user wajib diberikan",
      });
    }

    const transactions = await Transaction.findAll({
      where: {
        userEmail: email,
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("GET USER TRANSACTIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil transaksi user",
      error: error.message,
    });
  }
};

// =====================================================
// ADMIN - KONFIRMASI / TOLAK BOOKING
// =====================================================
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "menunggu",
      "dikonfirmasi",
      "ditolak",
      "menunggu_pembayaran",
      "dibayar",
      "selesai",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status transaksi tidak valid",
      });
    }

    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan",
      });
    }

    // Jika admin mengkonfirmasi booking
    if (status === "dikonfirmasi") {
      await transaction.update({
        status: "dikonfirmasi",
      });
    }

    // Jika admin menolak booking
    else if (status === "ditolak") {
      await transaction.update({
        status: "ditolak",
      });
    }

    // Status lainnya
    else {
      await transaction.update({
        status: status,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status transaksi berhasil diperbarui",
      data: transaction,
    });
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui status transaksi",
      error: error.message,
    });
  }
};

// =====================================================
// USER - KIRIM PEMBAYARAN
// =====================================================
exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan",
      });
    }

    // Pembayaran hanya boleh dilakukan
    // setelah admin mengkonfirmasi booking
    if (transaction.status !== "dikonfirmasi") {
      return res.status(400).json({
        success: false,
        message:
          "Pembayaran belum dapat dilakukan. Tunggu konfirmasi dari admin.",
      });
    }

    await transaction.update({
      paymentStatus: "menunggu_verifikasi",
      status: "menunggu_pembayaran",
    });

    return res.status(200).json({
      success: true,
      message:
        "Pembayaran berhasil dikirim dan menunggu verifikasi admin",
      data: transaction,
    });
  } catch (error) {
    console.error("UPDATE PAYMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal memproses pembayaran",
      error: error.message,
    });
  }
};

// =====================================================
// ADMIN - KONFIRMASI PEMBAYARAN
// =====================================================
exports.confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan",
      });
    }

    if (
      transaction.paymentStatus !== "menunggu_verifikasi"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Tidak ada pembayaran yang menunggu verifikasi",
      });
    }

    await transaction.update({
      paymentStatus: "dibayar",
      status: "dibayar",
    });

    return res.status(200).json({
      success: true,
      message: "Pembayaran berhasil dikonfirmasi",
      data: transaction,
    });
  } catch (error) {
    console.error("CONFIRM PAYMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengkonfirmasi pembayaran",
      error: error.message,
    });
  }
};

// =====================================================
// ADMIN - SELESAIKAN TRANSAKSI
// =====================================================
exports.finishTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan",
      });
    }

    if (transaction.paymentStatus !== "dibayar") {
      return res.status(400).json({
        success: false,
        message:
          "Transaksi belum dapat diselesaikan karena pembayaran belum dikonfirmasi",
      });
    }

    await transaction.update({
      status: "selesai",
    });

    return res.status(200).json({
      success: true,
      message: "Transaksi berhasil diselesaikan",
      data: transaction,
    });
  } catch (error) {
    console.error("FINISH TRANSACTION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal menyelesaikan transaksi",
      error: error.message,
    });
  }
};

// =====================================================
// ADMIN - HAPUS TRANSAKSI
// =====================================================
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan",
      });
    }

    await transaction.destroy();

    return res.status(200).json({
      success: true,
      message: "Transaksi berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE TRANSACTION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal menghapus transaksi",
      error: error.message,
    });
  }
};