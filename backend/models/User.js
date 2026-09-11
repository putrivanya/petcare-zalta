const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    nama: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    id_role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // ✅ FIELD BARU
    alamat: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // ✅ FIELD BARU
    no_telpon: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

module.exports = User;