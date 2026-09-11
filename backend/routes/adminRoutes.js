// ======================================================
// IMPORT
// ======================================================

const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const sequelize = require("../config/database");

const { createCRUD } = require("../controllers/crudController");


// ======================================================
// MODELS
// ======================================================

const Product = require("../models/Product");
const Doctor = require("../models/Doctor");
const Grooming = require("../models/Grooming");
const Hotel = require("../models/Hotel");
const Adoption = require("../models/Adoption");
const AnimalCategory = require("../models/AnimalCategory");


// ======================================================
// OPTIONAL MODELS
// ======================================================

let User = null;
let Booking = null;
let Payment = null;
let Review = null;

try {
  User = require("../models/User");
} catch (error) {
  console.log("Model User belum tersedia");
}

try {
  Booking = require("../models/Booking");
} catch (error) {
  console.log("Model Booking belum tersedia");
}

try {
  Payment = require("../models/Payment");
} catch (error) {
  console.log("Model Payment belum tersedia");
}

try {
  Review = require("../models/Review");
} catch (error) {
  console.log("Model Review belum tersedia");
}


// ======================================================
// UPLOAD DIRECTORY
// ======================================================

const uploadsDir = path.join(
  __dirname,
  "../uploads"
);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, {
    recursive: true,
  });
}


// ======================================================
// MULTER STORAGE
// ======================================================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(
      null,
      uploadsDir
    );

  },

  filename: (req, file, cb) => {

    const extension =
      path.extname(
        file.originalname
      );

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(
        Math.random() * 1000000000
      ) +
      extension;

    cb(
      null,
      uniqueName
    );

  },

});


// ======================================================
// MULTER
// ======================================================

const upload = multer({

  storage,

  limits: {
    fileSize:
      5 * 1024 * 1024,
  },

  fileFilter: (
    req,
    file,
    cb
  ) => {

    const allowedExtensions =
      /\.(jpeg|jpg|png|webp|gif)$/i;

    const allowedMime =
      /^image\/(jpeg|jpg|png|webp|gif)$/i;

    const validExtension =
      allowedExtensions.test(
        file.originalname
      );

    const validMime =
      allowedMime.test(
        file.mimetype
      );

    if (
      validExtension &&
      validMime
    ) {

      cb(
        null,
        true
      );

    } else {

      cb(
        new Error(
          "File harus berupa gambar JPG, JPEG, PNG, WEBP atau GIF."
        )
      );

    }

  },

});


// ======================================================
// CRUD
// ======================================================

const doctorCRUD =
  createCRUD(Doctor);

const groomingCRUD =
  createCRUD(Grooming);

const hotelCRUD =
  createCRUD(Hotel);

const adoptionCRUD =
  createCRUD(Adoption);

const animalCategoryCRUD =
  createCRUD(AnimalCategory);


// ======================================================
// OPTIONAL CRUD
// ======================================================

const optionalCRUD = (
  Model,
  name
) => {

  if (!Model) {

    return {

      getAll: async (
        req,
        res
      ) => {

        res.status(200).json([]);

      },

      getById: async (
        req,
        res
      ) => {

        res.status(404).json({
          success: false,
          message:
            `Model ${name} belum tersedia`,
        });

      },

      create: async (
        req,
        res
      ) => {

        res.status(500).json({
          success: false,
          message:
            `Model ${name} belum tersedia`,
        });

      },

      update: async (
        req,
        res
      ) => {

        res.status(500).json({
          success: false,
          message:
            `Model ${name} belum tersedia`,
        });

      },

      delete: async (
        req,
        res
      ) => {

        res.status(500).json({
          success: false,
          message:
            `Model ${name} belum tersedia`,
        });

      },

    };

  }

  return createCRUD(Model);

};


const userCRUD =
  optionalCRUD(
    User,
    "User"
  );

const bookingCRUD =
  optionalCRUD(
    Booking,
    "Booking"
  );

const paymentCRUD =
  optionalCRUD(
    Payment,
    "Payment"
  );

const reviewCRUD =
  optionalCRUD(
    Review,
    "Review"
  );


// ======================================================
// PRODUCTS
// ======================================================
//
// Product dibuat manual di sini supaya:
// 1. GET /api/products tidak tergantung crudController
// 2. POST bisa menerima multer image
// 3. image disimpan sebagai /uploads/nama-file
// 4. cocok dengan tabel products kamu
//
// ======================================================


// ------------------------------------------------------
// GET ALL PRODUCTS
// ------------------------------------------------------

router.get(
  "/products",
  async (
    req,
    res
  ) => {

    try {

      console.log(
        "GET /api/products"
      );

      const products =
        await Product.findAll({
          order: [
            ["id", "DESC"],
          ],
        });

      console.log(
        "Jumlah produk:",
        products.length
      );

      return res.status(200).json(
        products
      );

    } catch (error) {

      console.error(
        "GET PRODUCTS ERROR:"
      );

      console.error(
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  }
);


// ------------------------------------------------------
// GET PRODUCT BY ID
// ------------------------------------------------------

router.get(
  "/products/:id",
  async (
    req,
    res
  ) => {

    try {

      const product =
        await Product.findByPk(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({
          success: false,
          message:
            "Produk tidak ditemukan",
        });

      }

      return res.status(200).json(
        product
      );

    } catch (error) {

      console.error(
        "GET PRODUCT BY ID ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  }
);


// ------------------------------------------------------
// CREATE PRODUCT
// ------------------------------------------------------

router.post(
  "/products",
  upload.single("image"),
  async (
    req,
    res
  ) => {

    try {

      console.log(
        "================================="
      );

      console.log(
        "POST /api/products"
      );

      console.log(
        "BODY:",
        req.body
      );

      console.log(
        "FILE:",
        req.file
      );

      console.log(
        "================================="
      );


      const {
        name,
        category,
        animal,
        description,
        price,
        stock,
        badge,
      } = req.body;


      // --------------------------------------------
      // VALIDASI
      // --------------------------------------------

      if (!name) {

        return res.status(400).json({
          success: false,
          message:
            "Nama produk wajib diisi",
        });

      }

      if (!category) {

        return res.status(400).json({
          success: false,
          message:
            "Kategori produk wajib diisi",
        });

      }


      // --------------------------------------------
      // IMAGE
      // --------------------------------------------

      let image = null;

      if (req.file) {

        image =
          "/uploads/" +
          req.file.filename;

      }


      // --------------------------------------------
      // CREATE
      // --------------------------------------------

      const product =
        await Product.create({

          name:
            name,

          category:
            category,

          animal:
            animal ||
            null,

          description:
            description ||
            null,

          price:
            Number(price) ||
            0,

          stock:
            Number(stock) ||
            0,

          badge:
            badge ||
            null,

          image:
            image,

        });


      console.log(
        "PRODUCT CREATED:",
        product.toJSON()
      );


      return res.status(201).json({

        success: true,

        message:
          "Produk berhasil ditambahkan",

        data:
          product,

      });

    } catch (error) {

      console.error(
        "CREATE PRODUCT ERROR:"
      );

      console.error(
        error
      );


      // Kalau database gagal setelah file
      // berhasil disimpan, hapus file tersebut.

      if (req.file) {

        const uploadedPath =
          path.join(
            uploadsDir,
            req.file.filename
          );

        if (
          fs.existsSync(
            uploadedPath
          )
        ) {

          try {

            fs.unlinkSync(
              uploadedPath
            );

          } catch (
            deleteError
          ) {

            console.error(
              "Gagal menghapus file:",
              deleteError
            );

          }

        }

      }


      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Gagal menambahkan produk",

      });

    }

  }
);


// ------------------------------------------------------
// UPDATE PRODUCT
// ------------------------------------------------------

router.put(
  "/products/:id",
  upload.single("image"),
  async (
    req,
    res
  ) => {

    try {

      const id =
        req.params.id;


      console.log(
        "PUT /api/products/" +
        id
      );

      console.log(
        "BODY:",
        req.body
      );

      console.log(
        "FILE:",
        req.file
      );


      const product =
        await Product.findByPk(
          id
        );


      if (!product) {

        return res.status(404).json({

          success: false,

          message:
            "Produk tidak ditemukan",

        });

      }


      const {
        name,
        category,
        animal,
        description,
        price,
        stock,
        badge,
      } = req.body;


      // --------------------------------------------
      // DATA LAMA
      // --------------------------------------------

      let image =
        product.image;


      // --------------------------------------------
      // FOTO BARU
      // --------------------------------------------

      if (req.file) {

        image =
          "/uploads/" +
          req.file.filename;


        // hapus foto lama
        if (
          product.image &&
          product.image.startsWith(
            "/uploads/"
          )
        ) {

          const oldFile =
            path.join(
              __dirname,
              "..",
              product.image
            );


          if (
            fs.existsSync(
              oldFile
            )
          ) {

            try {

              fs.unlinkSync(
                oldFile
              );

            } catch (
              error
            ) {

              console.error(
                "Gagal menghapus gambar lama:",
                error
              );

            }

          }

        }

      }


      // --------------------------------------------
      // UPDATE
      // --------------------------------------------

      await product.update({

        name:
          name !== undefined
            ? name
            : product.name,

        category:
          category !== undefined
            ? category
            : product.category,

        animal:
          animal !== undefined
            ? animal
            : product.animal,

        description:
          description !== undefined
            ? description
            : product.description,

        price:
          price !== undefined
            ? Number(price)
            : product.price,

        stock:
          stock !== undefined
            ? Number(stock)
            : product.stock,

        badge:
          badge !== undefined
            ? badge
            : product.badge,

        image:
          image,

      });


      return res.status(200).json({

        success: true,

        message:
          "Produk berhasil diperbarui",

        data:
          product,

      });

    } catch (error) {

      console.error(
        "UPDATE PRODUCT ERROR:"
      );

      console.error(
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Gagal memperbarui produk",

      });

    }

  }
);


// ------------------------------------------------------
// DELETE PRODUCT
// ------------------------------------------------------

router.delete(
  "/products/:id",
  async (
    req,
    res
  ) => {

    try {

      const product =
        await Product.findByPk(
          req.params.id
        );


      if (!product) {

        return res.status(404).json({

          success: false,

          message:
            "Produk tidak ditemukan",

        });

      }


      // --------------------------------------------
      // HAPUS FILE
      // --------------------------------------------

      if (
        product.image &&
        product.image.startsWith(
          "/uploads/"
        )
      ) {

        const imagePath =
          path.join(
            __dirname,
            "..",
            product.image
          );


        if (
          fs.existsSync(
            imagePath
          )
        ) {

          try {

            fs.unlinkSync(
              imagePath
            );

          } catch (
            error
          ) {

            console.error(
              "Gagal menghapus gambar:",
              error
            );

          }

        }

      }


      // --------------------------------------------
      // HAPUS DATABASE
      // --------------------------------------------

      await product.destroy();


      return res.status(200).json({

        success: true,

        message:
          "Produk berhasil dihapus",

      });

    } catch (error) {

      console.error(
        "DELETE PRODUCT ERROR:"
      );

      console.error(
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Gagal menghapus produk",

      });

    }

  }
);


// ======================================================
// DOCTORS
// ======================================================

router.get(
  "/doctors",
  doctorCRUD.getAll
);

router.get(
  "/doctors/:id",
  doctorCRUD.getById
);

router.post(
  "/doctors",
  upload.single("image"),
  doctorCRUD.create
);

router.put(
  "/doctors/:id",
  upload.single("image"),
  doctorCRUD.update
);

router.delete(
  "/doctors/:id",
  doctorCRUD.delete
);


// ======================================================
// GROOMING
// ======================================================

router.get(
  "/grooming",
  groomingCRUD.getAll
);

router.get(
  "/grooming/:id",
  groomingCRUD.getById
);

router.post(
  "/grooming",
  upload.single("image"),
  groomingCRUD.create
);

router.put(
  "/grooming/:id",
  upload.single("image"),
  groomingCRUD.update
);

router.delete(
  "/grooming/:id",
  groomingCRUD.delete
);


// ======================================================
// HOTELS
// ======================================================

router.get(
  "/hotels",
  hotelCRUD.getAll
);

router.get(
  "/hotels/:id",
  hotelCRUD.getById
);

router.post(
  "/hotels",
  upload.single("image"),
  hotelCRUD.create
);

router.put(
  "/hotels/:id",
  upload.single("image"),
  hotelCRUD.update
);

router.delete(
  "/hotels/:id",
  hotelCRUD.delete
);


// ======================================================
// ADOPTIONS
// ======================================================

router.get(
  "/adoptions",
  adoptionCRUD.getAll
);

router.get(
  "/adoptions/:id",
  adoptionCRUD.getById
);

router.post(
  "/adoptions",
  upload.single("image"),
  adoptionCRUD.create
);

router.put(
  "/adoptions/:id",
  upload.single("image"),
  adoptionCRUD.update
);

router.delete(
  "/adoptions/:id",
  adoptionCRUD.delete
);


// ======================================================
// ANIMAL CATEGORIES
// ======================================================

router.get(
  "/animal-categories",
  animalCategoryCRUD.getAll
);

router.get(
  "/animal-categories/:id",
  animalCategoryCRUD.getById
);

router.post(
  "/animal-categories",
  upload.single("image"),
  animalCategoryCRUD.create
);

router.put(
  "/animal-categories/:id",
  upload.single("image"),
  animalCategoryCRUD.update
);

router.delete(
  "/animal-categories/:id",
  animalCategoryCRUD.delete
);


// ======================================================
// USERS
// ======================================================

router.get(
  "/users",
  userCRUD.getAll
);

router.get(
  "/users/:id",
  userCRUD.getById
);

router.post(
  "/users",
  userCRUD.create
);

router.put(
  "/users/:id",
  userCRUD.update
);

router.delete(
  "/users/:id",
  userCRUD.delete
);


// ======================================================
// BOOKINGS
// ======================================================

router.get(
  "/bookings",
  bookingCRUD.getAll
);

router.get(
  "/bookings/:id",
  bookingCRUD.getById
);

router.post(
  "/bookings",
  bookingCRUD.create
);

router.put(
  "/bookings/:id",
  bookingCRUD.update
);

router.delete(
  "/bookings/:id",
  bookingCRUD.delete
);


// ======================================================
// PAYMENTS
// ======================================================

router.get(
  "/payments",
  paymentCRUD.getAll
);

router.get(
  "/payments/:id",
  paymentCRUD.getById
);

router.post(
  "/payments",
  paymentCRUD.create
);

router.put(
  "/payments/:id",
  paymentCRUD.update
);

router.delete(
  "/payments/:id",
  paymentCRUD.delete
);


// ======================================================
// REVIEWS
// ======================================================

router.get(
  "/reviews",
  reviewCRUD.getAll
);

router.get(
  "/reviews/:id",
  reviewCRUD.getById
);

router.post(
  "/reviews",
  reviewCRUD.create
);

router.put(
  "/reviews/:id",
  reviewCRUD.update
);

router.delete(
  "/reviews/:id",
  reviewCRUD.delete
);


// ======================================================
// TEST ADMIN
// ======================================================

router.get(
  "/admin-test",
  (req, res) => {

    res.json({

      success: true,

      message:
        "Admin routes berhasil",

    });

  }
);


// ======================================================
// MULTER ERROR HANDLER
// ======================================================

router.use(
  (
    err,
    req,
    res,
    next
  ) => {

    console.error(
      "ADMIN ROUTE ERROR:",
      err
    );


    if (
      err instanceof multer.MulterError
    ) {

      return res.status(400).json({

        success: false,

        message:
          `Upload error: ${err.message}`,

        code:
          err.code,

      });

    }


    if (err) {

      return res.status(400).json({

        success: false,

        message:
          err.message,

      });

    }


    next();

  }
);


// ======================================================
// EXPORT
// ======================================================

module.exports = router;