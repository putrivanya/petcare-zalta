const {
  DataTypes
} = require("sequelize");

const sequelize =
  require("../config/database");

const Booking =
  sequelize.define(
    "Booking",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      customerName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      service: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      itemId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      itemName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      price: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
      },

      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },

      bookingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      booking_time: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM(
          "menunggu",
          "waiting_payment",
          "payment_review",
          "paid",
          "selesai",
          "ditolak"
        ),

        defaultValue:
          "menunggu",
      },

      paymentStatus: {
        type: DataTypes.ENUM(
          "belum_bayar",
          "menunggu_konfirmasi",
          "dibayar",
          "ditolak"
        ),

        defaultValue:
          "belum_bayar",
      },
    },

    {
      tableName: "bookings",
      timestamps: true,
    }
  );

module.exports = Booking;