const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Role = require("../models/Role");

// =====================================================
// REGISTER
// =====================================================
const register = async (req, res) => {
  try {
    const { nama, email, password, alamat, no_telpon } = req.body;

    console.log("=================================");
    console.log("REGISTER");
    console.log("Nama:", nama);
    console.log("Email:", email);
    console.log("Alamat:", alamat);
    console.log("No Telpon:", no_telpon);
    console.log("=================================");

    if (!nama || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi!",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 6 karakter!",
      });
    }

    const namaBersih = nama.trim();
    const emailBersih = email.trim().toLowerCase();
    const alamatBersih = alamat ? String(alamat).trim() : "";
    const telponBersih = no_telpon ? String(no_telpon).trim() : "";

    const cekEmail = await User.findOne({
      where: { email: emailBersih },
    });

    if (cekEmail) {
      return res.status(400).json({
        success: false,
        message: "Email sudah digunakan.",
      });
    }

    const rolePelanggan = await Role.findOne({
      where: { nama_role: "pelanggan" },
    });

    if (!rolePelanggan) {
      return res.status(500).json({
        success: false,
        message: "Role pelanggan belum ada di database.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nama: namaBersih,
      email: emailBersih,
      password: hashedPassword,
      id_role: rolePelanggan.id_role,
      alamat: alamatBersih,
      no_telpon: telponBersih,
    });

    console.log("REGISTER BERHASIL:", user.email);

    return res.status(201).json({
      success: true,
      message: "Register berhasil!",
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        id_role: user.id_role,
        role: "pelanggan",
        alamat: user.alamat || "",
        no_telpon: user.no_telpon || "",
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =====================================================
// LOGIN
// =====================================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("=================================");
    console.log("LOGIN REQUEST");
    console.log("Email:", email);
    console.log("=================================");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi!",
      });
    }

    const emailBersih = email.trim().toLowerCase();

    // Ambil user — semua field otomatis ke-load
    const user = await User.findOne({
      where: { email: emailBersih },
    });

    if (!user) {
      console.log("Email tidak ditemukan:", emailBersih);
      return res.status(400).json({
        success: false,
        message: "Email tidak ditemukan!",
      });
    }

    console.log("User ditemukan:", user.nama);
    console.log("Alamat dari DB:", user.alamat);
    console.log("No Telpon dari DB:", user.no_telpon);

    const cocok = await bcrypt.compare(password, user.password);

    if (!cocok) {
      return res.status(400).json({
        success: false,
        message: "Password salah!",
      });
    }

    const role = await Role.findOne({
      where: { id_role: user.id_role },
    });

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role akun tidak ditemukan.",
      });
    }

    const namaRole = String(role.nama_role || "").trim().toLowerCase();

    if (namaRole !== "admin" && namaRole !== "pelanggan") {
      return res.status(400).json({
        success: false,
        message: "Role akun tidak valid.",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET belum diatur di file .env",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        id_role: user.id_role,
        role: namaRole,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("LOGIN BERHASIL:", user.email);

    // ✅ RESPONSE LENGKAP — dengan alamat & no_telpon
    return res.status(200).json({
      success: true,
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        id_role: user.id_role,
        role: namaRole,
        alamat: user.alamat || "",
        no_telpon: user.no_telpon || "",
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

module.exports = { register, login };