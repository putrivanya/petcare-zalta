const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AnimalCategory = sequelize.define(
  "AnimalCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    image: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },

    needs: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "animal_categories",
    timestamps: true,
  }
);

module.exports = AnimalCategory;