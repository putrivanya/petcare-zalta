const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Animal = sequelize.define(
  "Animal",
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

    icon: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "paw",
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "aktif",
        "nonaktif"
      ),
      defaultValue: "aktif",
    },
  },
  {
    tableName: "animals",
    timestamps: true,
  }
);

module.exports = Animal;