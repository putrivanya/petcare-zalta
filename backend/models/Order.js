const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM("COD", "E-Wallet", "Transfer Bank"),
      allowNull: false,
      defaultValue: "COD",
    },
    paymentStatus: {
      type: DataTypes.ENUM("belum_bayar", "menunggu_verifikasi", "dibayar"),
      defaultValue: "belum_bayar",
    },
    status: {
      type: DataTypes.ENUM("menunggu", "dikemas", "dikirim", "selesai", "ditolak"),
      defaultValue: "menunggu",
    },
    notes: {
      type: DataTypes.TEXT,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);

// Relasi
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

module.exports = Order;