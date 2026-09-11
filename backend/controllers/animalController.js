// Gantilah baris ini sesuai lokasi Model Animal Anda (Sequelize/Mongoose/Prisma)
const Animal = require("../models/Animal"); 
const fs = require("fs");
const path = require("path");

// ======================================================
// GET ALL ANIMALS
// ======================================================
exports.getAnimals = async (req, res, next) => {
  try {
    const animals = await Animal.findAll(); // Jika Mongoose: await Animal.find()
    return res.status(200).json({
      success: true,
      data: animals,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// CREATE ANIMAL
// ======================================================
exports.createAnimal = async (req, res, next) => {
  try {
    // Proteksi jika req.body tidak terbaca
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Data form (req.body) tidak ditemukan",
      });
    }

    const { name, category, description } = req.body;

    // Ambil path gambar jika ada file yang diunggah
    let imageUrl = null;
    if (req.file) {
      // Menyimpan path relatif seperti: /uploads/1724123456-123456.png
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Simpan ke database
    const newAnimal = await Animal.create({
      name,
      category,
      description,
      image: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Data hewan berhasil ditambahkan",
      data: newAnimal,
    });
  } catch (error) {
    console.error("ERROR CREATE ANIMAL:", error);
    next(error);
  }
};

// ======================================================
// UPDATE ANIMAL
// ======================================================
exports.updateAnimal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, description } = req.body;

    const animal = await Animal.findByPk(id); // Jika Mongoose: await Animal.findById(id)
    if (!animal) {
      return res.status(404).json({
        success: false,
        message: "Data hewan tidak ditemukan",
      });
    }

    let imageUrl = animal.image;

    // Jika ada unggahan gambar baru
    if (req.file) {
      // Hapus gambar lama jika ada di server
      if (animal.image) {
        const oldImagePath = path.join(__dirname, "..", animal.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Update data
    await animal.update({
      name,
      category,
      description,
      image: imageUrl,
    });

    return res.status(200).json({
      success: true,
      message: "Data hewan berhasil diperbarui",
      data: animal,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// DELETE ANIMAL
// ======================================================
exports.deleteAnimal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const animal = await Animal.findByPk(id);

    if (!animal) {
      return res.status(404).json({
        success: false,
        message: "Data hewan tidak ditemukan",
      });
    }

    // Hapus file gambar dari server
    if (animal.image) {
      const imagePath = path.join(__dirname, "..", animal.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await animal.destroy();

    return res.status(200).json({
      success: true,
      message: "Data hewan berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};