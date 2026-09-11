const express = require("express");
const router = express.Router();

const Payment = require("../models/Payment");
const Booking = require("../models/Booking");


// ======================================================
// CLIENT - KIRIM PEMBAYARAN
// ======================================================

router.post("/", async (req, res) => {

  try {

    const {
      booking_id,
      user_id,
      amount,
      payment_method,
      payment_proof,
    } = req.body;


    // ================================================
    // VALIDASI
    // ================================================

    if (!booking_id) {

      return res.status(400).json({

        success: false,

        message:
          "Booking wajib dipilih",
      });
    }


    if (!user_id) {

      return res.status(400).json({

        success: false,

        message:
          "User belum login",
      });
    }


    if (!amount) {

      return res.status(400).json({

        success: false,

        message:
          "Jumlah pembayaran wajib diisi",
      });
    }


    if (!payment_method) {

      return res.status(400).json({

        success: false,

        message:
          "Metode pembayaran wajib dipilih",
      });
    }


    // ================================================
    // CARI BOOKING
    // ================================================

    const booking =
      await Booking.findByPk(
        booking_id
      );


    if (!booking) {

      return res.status(404).json({

        success: false,

        message:
          "Booking tidak ditemukan",
      });
    }


    // ================================================
    // HANYA BOOKING YANG SUDAH DIKONFIRMASI
    // YANG BOLEH BAYAR
    // ================================================

    if (
      booking.status !==
      "waiting_payment"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Booking belum dikonfirmasi admin atau pembayaran sudah dikirim.",
      });
    }


    // ================================================
    // CEGAH DOUBLE PAYMENT
    // ================================================

    const existingPayment =
      await Payment.findOne({

        where: {
          booking_id:
            booking_id,

          status:
            "pending",
        },

      });


    if (existingPayment) {

      return res.status(400).json({

        success: false,

        message:
          "Pembayaran untuk booking ini sedang diperiksa admin.",
      });
    }


    // ================================================
    // BUAT PAYMENT
    // ================================================

    const payment =
      await Payment.create({

        booking_id:
          booking_id,

        user_id:
          user_id,

        amount:
          Number(amount),

        payment_method:
          payment_method,

        payment_proof:
          payment_proof || null,

        status:
          "pending",
      });


    // ================================================
    // UPDATE BOOKING
    // ================================================

    booking.status =
      "payment_review";

    booking.paymentStatus =
      "menunggu_konfirmasi";


    await booking.save();


    return res.status(201).json({

      success: true,

      message:
        "Pembayaran berhasil dikirim dan sedang diperiksa admin.",

      payment,

      booking,
    });


  } catch (error) {

    console.error(
      "GAGAL MENGIRIM PEMBAYARAN:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Gagal mengirim pembayaran",

      error:
        error.message,
    });
  }

});


// ======================================================
// CLIENT - PAYMENT MILIK USER
// ======================================================

router.get(
  "/user/:userId",
  async (req, res) => {

    try {

      const payments =
        await Payment.findAll({

          where: {
            user_id:
              req.params.userId,
          },

          order: [
            ["createdAt", "DESC"],
          ],

        });


      return res.json({

        success: true,

        payments,

      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({

        success: false,

        message:
          "Gagal mengambil pembayaran",

        error:
          error.message,
      });
    }
  }
);


// ======================================================
// ADMIN - LIHAT SEMUA PEMBAYARAN
// ======================================================

router.get(
  "/",
  async (req, res) => {

    try {

      const payments =
        await Payment.findAll({

          order: [
            ["createdAt", "DESC"],
          ],

        });


      return res.json(
        payments
      );

    } catch (error) {

      console.error(error);

      return res.status(500).json({

        success: false,

        message:
          "Gagal mengambil pembayaran",

        error:
          error.message,
      });
    }
  }
);


// ======================================================
// ADMIN - KONFIRMASI / TOLAK PAYMENT
// ======================================================

router.put(
  "/:id/status",
  async (req, res) => {

    try {

      const {
        status,
      } = req.body;


      const allowedStatus = [

        "pending",

        "confirmed",

        "rejected",

      ];


      if (
        !allowedStatus.includes(
          status
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Status pembayaran tidak valid",
        });
      }


      const payment =
        await Payment.findByPk(
          req.params.id
        );


      if (!payment) {

        return res.status(404).json({

          success: false,

          message:
            "Pembayaran tidak ditemukan",
        });
      }


      payment.status =
        status;


      await payment.save();


      // ================================================
      // UPDATE BOOKING
      // ================================================

      const booking =
        await Booking.findByPk(
          payment.booking_id
        );


      if (booking) {

        if (
          status ===
          "confirmed"
        ) {

          booking.status =
            "paid";

          booking.paymentStatus =
            "dibayar";
        }


        if (
          status ===
          "rejected"
        ) {

          booking.status =
            "waiting_payment";

          booking.paymentStatus =
            "ditolak";
        }


        if (
          status ===
          "pending"
        ) {

          booking.status =
            "payment_review";

          booking.paymentStatus =
            "menunggu_konfirmasi";
        }


        await booking.save();
      }


      return res.json({

        success: true,

        message:
          "Status pembayaran berhasil diubah",

        payment,

        booking,
      });


    } catch (error) {

      console.error(
        "GAGAL UPDATE PAYMENT:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Gagal mengubah pembayaran",

        error:
          error.message,
      });
    }

  }
);


module.exports = router;