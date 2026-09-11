const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Review = sequelize.define("Review", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  buyerKey: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  rating: {
    type: DataTypes.INTEGER, // 1 - 5 Bintang
    allowNull: false,
  },

  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  type: {
    type: DataTypes.ENUM("product", "store"),
    allowNull: false,
    defaultValue: "product",
  },
});

module.exports = Review;