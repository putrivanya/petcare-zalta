const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Consultation = sequelize.define(
  "Consultation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    userName: { type: DataTypes.STRING, allowNull: true },
    userEmail: { type: DataTypes.STRING, allowNull: true },
    userPhone: { type: DataTypes.STRING, allowNull: true },
    doctorId: { type: DataTypes.INTEGER, allowNull: true },
    doctorName: { type: DataTypes.STRING, allowNull: true },
    doctorSpecialization: { type: DataTypes.STRING, allowNull: true },
    complaint: { type: DataTypes.TEXT, allowNull: true },
    reply: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING, defaultValue: "menunggu" },
  },
  {
    tableName: "consultations",
    timestamps: true,
  }
);

module.exports = Consultation;