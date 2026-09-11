const express = require("express");

const router = express.Router();

const AdoptionRequest = require("../models/AdoptionRequest");


// ======================================================
// TEST ADOPTION API
// GET /api/adoption-requests
// ======================================================

router.get("/", async (req, res) => {
  try {
    const adoptionRequests =
      await AdoptionRequest.findAll({
        order: [
          ["created_at", "DESC"],
        ],
      });

    res.json({
      success: true,
      data: adoptionRequests,
    });

  } catch (error) {
    console.error(
      "GET ADOPTION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Gagal mengambil data pengajuan adopsi",
      error: error.message,
    });
  }
});


// ======================================================
// GET DETAIL ADOPSI
// GET /api/adoption-requests/:id
// ======================================================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const adoption =
      await AdoptionRequest.findByPk(id);

    if (!adoption) {
      return res.status(404).json({
        success: false,
        message:
          "Pengajuan adopsi tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: adoption,
    });

  } catch (error) {
    console.error(
      "GET DETAIL ADOPTION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Gagal mengambil detail pengajuan adopsi",
      error: error.message,
    });
  }
});


// ======================================================
// POST - AJUKAN ADOPSI
// POST /api/adoption-requests
// ======================================================

router.post("/", async (req, res) => {
  try {
    console.log(
      "================================="
    );

    console.log(
      "POST PENGAJUAN ADOPSI"
    );

    console.log(
      "BODY:",
      req.body
    );

    console.log(
      "================================="
    );


    const {
      animal_id,
      animalId,

      user_id,
      userId,

      nama_lengkap,
      nama,
      name,

      nomor_telepon,
      no_telepon,
      phone,
      telephone,

      alamat,
      address,

      alasan_adopsi,
      alasan,
      reason,
    } = req.body;


    // ==================================================
    // NORMALISASI DATA
    // ==================================================

    const finalAnimalId =
      animal_id || animalId;

    const finalUserId =
      user_id || userId || null;

    const finalNama =
      nama_lengkap ||
      nama ||
      name;

    const finalPhone =
      nomor_telepon ||
      no_telepon ||
      phone ||
      telephone;

    const finalAlamat =
      alamat ||
      address;

    const finalAlasan =
      alasan_adopsi ||
      alasan ||
      reason;


    // ==================================================
    // VALIDASI
    // ==================================================

    if (!finalAnimalId) {
      return res.status(400).json({
        success: false,
        message:
          "ID hewan wajib diisi",
      });
    }


    if (!finalNama) {
      return res.status(400).json({
        success: false,
        message:
          "Nama lengkap wajib diisi",
      });
    }


    if (!finalPhone) {
      return res.status(400).json({
        success: false,
        message:
          "Nomor telepon wajib diisi",
      });
    }


    if (!finalAlamat) {
      return res.status(400).json({
        success: false,
        message:
          "Alamat wajib diisi",
      });
    }


    if (!finalAlasan) {
      return res.status(400).json({
        success: false,
        message:
          "Alasan adopsi wajib diisi",
      });
    }


    // ==================================================
    // SIMPAN DATABASE
    // ==================================================

    const adoption =
      await AdoptionRequest.create({
        animal_id: finalAnimalId,

        user_id: finalUserId,

        nama_lengkap: finalNama,

        nomor_telepon: finalPhone,

        alamat: finalAlamat,

        alasan_adopsi: finalAlasan,

        status: "pending",
      });


    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(201).json({
      success: true,

      message:
        "Pengajuan adopsi berhasil dikirim",

      data: adoption,
    });

  } catch (error) {

    console.error(
      "POST ADOPTION ERROR:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Gagal menyimpan pengajuan adopsi",

      error:
        error.message,
    });
  }
});


// ======================================================
// UPDATE STATUS ADOPSI
// PUT /api/adoption-requests/:id/status
// ======================================================

router.put(
  "/:id/status",
  async (req, res) => {
    try {

      const { id } =
        req.params;

      const {
        status,
        catatan_admin,
      } = req.body;


      // ================================================
      // VALIDASI STATUS
      // ================================================

      const allowedStatus = [
        "pending",
        "approved",
        "rejected",
      ];


      if (
        !allowedStatus.includes(status)
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Status harus pending, approved, atau rejected",
        });
      }


      // ================================================
      // CARI DATA
      // ================================================

      const adoption =
        await AdoptionRequest.findByPk(id);


      if (!adoption) {
        return res.status(404).json({
          success: false,

          message:
            "Pengajuan adopsi tidak ditemukan",
        });
      }


      // ================================================
      // UPDATE
      // ================================================

      adoption.status =
        status;

      adoption.catatan_admin =
        catatan_admin || null;

      adoption.updated_at =
        new Date();


      await adoption.save();


      // ================================================
      // RESPONSE
      // ================================================

      res.json({
        success: true,

        message:
          "Status pengajuan adopsi berhasil diperbarui",

        data: adoption,
      });

    } catch (error) {

      console.error(
        "UPDATE ADOPTION STATUS ERROR:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          "Gagal memperbarui status adopsi",

        error:
          error.message,
      });
    }
  }
);


// ======================================================
// DELETE PENGAJUAN
// DELETE /api/adoption-requests/:id
// ======================================================

router.delete(
  "/:id",
  async (req, res) => {
    try {

      const { id } =
        req.params;


      const adoption =
        await AdoptionRequest.findByPk(id);


      if (!adoption) {
        return res.status(404).json({
          success: false,

          message:
            "Pengajuan adopsi tidak ditemukan",
        });
      }


      await adoption.destroy();


      res.json({
        success: true,

        message:
          "Pengajuan adopsi berhasil dihapus",
      });

    } catch (error) {

      console.error(
        "DELETE ADOPTION ERROR:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          "Gagal menghapus pengajuan adopsi",

        error:
          error.message,
      });
    }
  }
);


module.exports = router;