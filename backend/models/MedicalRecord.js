const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const MedicalRecord = sequelize.define(
  "MedicalRecord",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    petName: { type: DataTypes.STRING, allowNull: true },
    petType: { type: DataTypes.STRING, allowNull: true },
    ownerName: { type: DataTypes.STRING, allowNull: true },
    ownerPhone: { type: DataTypes.STRING, allowNull: true },
    ownerEmail: { type: DataTypes.STRING, allowNull: true },
    doctorName: { type: DataTypes.STRING, allowNull: true },
    visitDate: { type: DataTypes.DATEONLY, allowNull: true },
    complaint: { type: DataTypes.TEXT, allowNull: true },
    diagnosis: { type: DataTypes.TEXT, allowNull: true },
    treatment: { type: DataTypes.TEXT, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "medical_records",
    timestamps: true,
  }
);

module.exports = MedicalRecord;