const {
  DataTypes,
} = require("sequelize");

const sequelize =
  require("../config/database");

const Doctor =
  sequelize.define(
    "Doctor",
    {

      id: {
        type:
          DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type:
          DataTypes.STRING(150),
        allowNull: false,
      },

      specialization: {
        type:
          DataTypes.STRING(150),
        allowNull: true,
      },

      description: {
        type:
          DataTypes.TEXT,
        allowNull: true,
      },

      price: {
        type:
          DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },

      schedule: {
        type:
          DataTypes.STRING(255),
        allowNull: true,
      },

      phone: {
        type:
          DataTypes.STRING(50),
        allowNull: true,
      },

      image: {
        type:
          DataTypes.STRING(255),
        allowNull: true,
      },

    },

    {
      tableName: "doctors",
      timestamps: true,
    }
  );

module.exports = Doctor;