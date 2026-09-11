const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AnimalNeed = sequelize.define(
  "AnimalNeed",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    animalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    category: {
      type: DataTypes.ENUM(
        "Makanan",
        "Baju",
        "Mainan",
        "Kandang",
        "Vitamin",
        "Grooming",
        "Lainnya"
      ),
      defaultValue: "Makanan",
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },

    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "tersedia",
        "habis"
      ),
      defaultValue: "tersedia",
    },
  },
  {
    tableName: "animal_needs",
    timestamps: true,
  }
);

module.exports = AnimalNeed;