const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");

// ======================================================
// CLIENT - BUAT BOOKING
// ======================================================

router.post("/", async (req, res) => {
  try {
    console.log("=================================");
    console.log("DATA BOOKING DARI FRONTEND");
    console.log(req.body);
    console.log("=================================");

    const {
      user_id,
      userId,

      customerName,
      email,
      phone,

      service,
      service_name,
      service_type,

      itemId,
      itemName,

      pet_name,
      pet_type,

      type,

      price,
      quantity,

      bookingDate,
      booking_date,

      booking_time,

      notes,
    } = req.body;

    // ==================================================
    // NORMALISASI
    // ==================================================

    const finalUserId =
      userId ||
      user_id ||
      null;

    const finalCustomerName =
      customerName || "";

    const finalEmail =
      email || "";

    const finalPhone =
      phone || "";

    const finalService =
      service ||
      service_name ||
      service_type ||
      "";

    const finalItemId =
      itemId || null;

    const finalItemName =
      itemName ||
      pet_name ||
      "";

    const finalType =
      type ||
      pet_type ||
      "Hewan";

    const finalPrice =
      Number(price) || 0;

    const finalQuantity =
      Number(quantity) || 1;

    const finalBookingDate =
      bookingDate ||
      booking_date ||
      null;

    const finalBookingTime =
      booking_time || null;

    const finalNotes =
      notes || "";

    // ==================================================
    // VALIDASI
    // ==================================================

    if (!finalUserId) {
      return res.status(400).json({
        success: false,
        message:
          "User belum login atau userId tidak ditemukan",
      });
    }

    if (!finalCustomerName) {
      return res.status(400).json({
        success: false,
        message:
          "Nama customer wajib diisi",
      });
    }

    if (!finalService) {
      return res.status(400).json({
        success: false,
        message:
          "Layanan wajib dipilih",
      });
    }

    if (!finalItemName) {
      return res.status(400).json({
        success: false,
        message:
          "Nama hewan wajib diisi",
      });
    }

    if (!finalBookingDate) {
      return res.status(400).json({
        success: false,
        message:
          "Tanggal booking wajib diisi",
      });
    }

    // ==================================================
    // BUAT BOOKING
    // ==================================================

    const booking = await Booking.create({
      userId: finalUserId,

      customerName:
        finalCustomerName,

      email:
        finalEmail,

      phone:
        finalPhone,

      service:
        finalService,

      itemId:
        finalItemId,

      itemName:
        finalItemName,

      type:
        finalType,

      price:
        finalPrice,

      quantity:
        finalQuantity,

      bookingDate:
        finalBookingDate,

      booking_time:
        finalBookingTime,

      // STATUS AWAL
      status:
        "menunggu",

      paymentStatus:
        "belum_bayar",

      notes:
        finalNotes,
    });

    console.log(
      "BOOKING BERHASIL DISIMPAN"
    );

    console.log(
      booking.toJSON()
    );

    return res.status(201).json({
      success: true,

      message:
        "Booking berhasil dibuat. Menunggu konfirmasi admin.",

      booking,
    });

  } catch (error) {

    console.error(
      "GAGAL MEMBUAT BOOKING:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Gagal membuat booking",

      error:
        error.message,
    });
  }
});


// ======================================================
// CLIENT - BOOKING MILIK USER
// ======================================================

router.get(
  "/user/:userId",
  async (req, res) => {

    try {

      const bookings =
        await Booking.findAll({

          where: {
            userId:
              req.params.userId,
          },

          order: [
            ["createdAt", "DESC"],
          ],

        });

      return res.json({

        success: true,

        bookings,

      });

    } catch (error) {

      console.error(
        "GAGAL MENGAMBIL BOOKING USER:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Gagal mengambil booking",

        error:
          error.message,
      });
    }
  }
);


// ======================================================
// ADMIN - SEMUA BOOKING
// ======================================================

router.get(
  "/",
  async (req, res) => {

    try {

      const bookings =
        await Booking.findAll({

          order: [
            ["createdAt", "DESC"],
          ],

        });

      return res.json(
        bookings
      );

    } catch (error) {

      console.error(
        "GAGAL MENGAMBIL SEMUA BOOKING:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Gagal mengambil booking",

        error:
          error.message,
      });
    }
  }
);


// ======================================================
// ADMIN - UPDATE STATUS BOOKING
// ======================================================

router.put(
  "/:id/status",
  async (req, res) => {

    try {

      const {
        status,
      } = req.body;

      const allowedStatus = [

        "menunggu",

        // SETELAH ADMIN KONFIRMASI
        "waiting_payment",

        // SETELAH USER MENGIRIM PEMBAYARAN
        "payment_review",

        // PEMBAYARAN SUDAH DITERIMA
        "paid",

        // BOOKING SELESAI
        "selesai",

        // BOOKING DITOLAK
        "ditolak",
      ];

      if (!status) {

        return res.status(400).json({

          success: false,

          message:
            "Status wajib diisi",
        });
      }

      if (
        !allowedStatus.includes(
          status
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Status tidak valid",
        });
      }

      const booking =
        await Booking.findByPk(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking tidak ditemukan",
        });
      }

      booking.status =
        status;

      // Jika kembali menunggu pembayaran
      if (
        status ===
        "waiting_payment"
      ) {

        booking.paymentStatus =
          "belum_bayar";
      }

      // Jika pembayaran sedang diperiksa
      if (
        status ===
        "payment_review"
      ) {

        booking.paymentStatus =
          "menunggu_konfirmasi";
      }

      // Jika sudah dibayar
      if (
        status ===
        "paid"
      ) {

        booking.paymentStatus =
          "dibayar";
      }

      await booking.save();

      return res.json({

        success: true,

        message:
          "Status booking berhasil diubah",

        booking,
      });

    } catch (error) {

      console.error(
        "GAGAL UPDATE STATUS BOOKING:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Gagal mengubah status booking",

        error:
          error.message,
      });
    }
  }
);


// ======================================================
// ADMIN - KONFIRMASI BOOKING
// ======================================================

router.put(
  "/:id/confirm",
  async (req, res) => {

    try {

      const booking =
        await Booking.findByPk(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking tidak ditemukan",
        });
      }

      // ================================================
      // INI BAGIAN PALING PENTING
      // ================================================

      booking.status =
        "waiting_payment";

      booking.paymentStatus =
        "belum_bayar";

      await booking.save();

      console.log(
        `Booking ${booking.id} → waiting_payment`
      );

      return res.json({

        success: true,

        message:
          "Booking dikonfirmasi. User sekarang dapat melakukan pembayaran.",

        booking,
      });

    } catch (error) {

      console.error(
        "GAGAL KONFIRMASI BOOKING:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Gagal mengonfirmasi booking",

        error:
          error.message,
      });
    }
  }
);


// ======================================================
// ADMIN - TOLAK BOOKING
// ======================================================

router.put(
  "/:id/reject",
  async (req, res) => {

    try {

      const booking =
        await Booking.findByPk(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking tidak ditemukan",
        });
      }

      booking.status =
        "ditolak";

      booking.paymentStatus =
        "belum_bayar";

      await booking.save();

      return res.json({

        success: true,

        message:
          "Booking ditolak admin",

        booking,
      });

    } catch (error) {

      console.error(
        "GAGAL MENOLAK BOOKING:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Gagal menolak booking",

        error:
          error.message,
      });
    }
  }
);


// ======================================================
// ADMIN - SELESAIKAN BOOKING
// ======================================================

router.put(
  "/:id/complete",
  async (req, res) => {

    try {

      const booking =
        await Booking.findByPk(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking tidak ditemukan",
        });
      }

      booking.status =
        "selesai";

      await booking.save();

      return res.json({

        success: true,

        message:
          "Booking berhasil diselesaikan",

        booking,
      });

    } catch (error) {

      console.error(
        "GAGAL MENYELESAIKAN BOOKING:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Gagal menyelesaikan booking",

        error:
          error.message,
      });
    }
  }
);


// ======================================================
// ADMIN - UPDATE PAYMENT STATUS
// ======================================================

router.put(
  "/:id/payment-status",
  async (req, res) => {

    try {

      const {
        paymentStatus,
      } = req.body;

      const allowedPaymentStatus = [

        "belum_bayar",

        "menunggu_konfirmasi",

        "dibayar",

        "ditolak",

      ];

      if (
        !paymentStatus
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Payment status wajib diisi",
        });
      }

      if (
        !allowedPaymentStatus.includes(
          paymentStatus
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Payment status tidak valid",
        });
      }

      const booking =
        await Booking.findByPk(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking tidak ditemukan",
        });
      }

      booking.paymentStatus =
        paymentStatus;

      if (
        paymentStatus ===
        "menunggu_konfirmasi"
      ) {

        booking.status =
          "payment_review";
      }

      if (
        paymentStatus ===
        "dibayar"
      ) {

        booking.status =
          "paid";
      }

      if (
        paymentStatus ===
        "ditolak"
      ) {

        booking.status =
          "waiting_payment";
      }

      await booking.save();

      return res.json({

        success: true,

        message:
          "Status pembayaran berhasil diubah",

        booking,
      });

    } catch (error) {

      console.error(
        "GAGAL UPDATE PAYMENT STATUS:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Gagal mengubah status pembayaran",

        error:
          error.message,
      });
    }
  }
);


module.exports = router;