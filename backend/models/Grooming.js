const {
  DataTypes,
} = require("sequelize");

const sequelize =
  require("../config/database");

const Grooming =
  sequelize.define(
    "Grooming",
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

      duration: {
        type:
          DataTypes.STRING(100),
        allowNull: true,
      },

      animal: {
        type:
          DataTypes.STRING(100),
        allowNull: true,
      },

      image: {
        type:
          DataTypes.STRING(255),
        allowNull: true,
      },

    },

    {
      tableName: "grooming",
      timestamps: true,
    }
  );

module.exports = Grooming;