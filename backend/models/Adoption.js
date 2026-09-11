const {
  DataTypes,
} = require("sequelize");

const sequelize =
  require("../config/database");

const Adoption =
  sequelize.define(
    "Adoption",
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

      animal: {
        type:
          DataTypes.STRING(100),
        allowNull: true,
      },

      breed: {
        type:
          DataTypes.STRING(100),
        allowNull: true,
      },

      age: {
        type:
          DataTypes.STRING(100),
        allowNull: true,
      },

      gender: {
        type:
          DataTypes.STRING(50),
        allowNull: true,
      },

      description: {
        type:
          DataTypes.TEXT,
        allowNull: true,
      },

      status: {
        type:
          DataTypes.STRING(50),
        allowNull: true,
        defaultValue:
          "Tersedia",
      },

      image: {
        type:
          DataTypes.STRING(255),
        allowNull: true,
      },

    },

    {
      tableName: "adoptions",
      timestamps: true,
    }
  );

module.exports = Adoption;