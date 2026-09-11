const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Konfigurasi Penyimpanan Gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Pastikan folder 'uploads' sudah dibuat di folder backend
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Terapkan upload.single('image') pada method POST dan PUT
router.post('/', upload.single('image'), productController.createProduct);
router.put('/:id', upload.single('image'), productController.updateProduct);

module.exports = router;