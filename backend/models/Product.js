const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    animal: {
      type: DataTypes.STRING(100),
      allowNull: true,
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
      allowNull: false,
      defaultValue: 0,
    },

    badge: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    image: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
  },
  {
    tableName: "products",

    // Supaya Sequelize tidak membuat createdAt/updatedAt
    // jika tabel products lama tidak mempunyai kolom tersebut.
    timestamps: false,
  }
);

module.exports = Product;