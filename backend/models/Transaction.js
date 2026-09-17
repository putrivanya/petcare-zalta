const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Transaction = sequelize.define(
  "Transaction",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    items: {
      type: DataTypes.TEXT, // Menyimpan JSON string dari array items
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
    },
    postalCode: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      defaultValue: "COD",
    },
    notes: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM("menunggu", "dikemas", "dikirim", "selesai", "ditolak", "dibatalkan"),
      defaultValue: "menunggu",
    },
    paymentStatus: {
      type: DataTypes.ENUM("belum_bayar", "menunggu_verifikasi", "dibayar"),
      defaultValue: "belum_bayar",
    },
    isReviewed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userName: DataTypes.STRING,
    userEmail: DataTypes.STRING,
    userPhone: DataTypes.STRING,
    itemName: DataTypes.STRING,
    type: DataTypes.STRING,
    date: DataTypes.STRING,
    time: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(10, 2),
    
    // ==========================================
    // TAMBAHKAN 2 FIELD INI (PENYEBAB UTAMA!)
    // ==========================================
    courier: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    trackingNumber: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Transaction;