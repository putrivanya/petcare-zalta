// ======================================================
// MODELS INDEX
// ======================================================

const Product = require("./Product");
const Doctor = require("./Doctor");
const Grooming = require("./Grooming");
const Hotel = require("./Hotel");
const Adoption = require("./Adoption");
const AnimalCategory = require("./AnimalCategory");
const Animal = require("./Animal");
const AnimalNeed = require("./AnimalNeed");
const User = require("./User");
const Role = require("./Role");

// Opsional: jika ada file model ini, import
let Payment = null;
let Booking = null;
let Review = null;
let Transaction = null;

try {
  Payment = require("./Payment");
} catch (e) {
  console.warn("⚠️ Model Payment tidak ditemukan, lewati.");
}

try {
  Booking = require("./Booking");
} catch (e) {
  console.warn("⚠️ Model Booking tidak ditemukan, lewati.");
}

try {
  Review = require("./Review");
} catch (e) {
  console.warn("⚠️ Model Review tidak ditemukan, lewati.");
}

try {
  Transaction = require("./Transaction");
} catch (e) {
  console.warn("⚠️ Model Transaction tidak ditemukan, lewati.");
}

// ======================================================
// RELASI (jika ada)
// ======================================================

Animal.hasMany(AnimalNeed, {
  foreignKey: "animalId",
  as: "needs",
});

AnimalNeed.belongsTo(Animal, {
  foreignKey: "animalId",
  as: "animal",
});

User.belongsTo(Role, {
  foreignKey: "id_role",
  targetKey: "id_role",
  as: "roleData",
});

Role.hasMany(User, {
  foreignKey: "id_role",
  sourceKey: "id_role",
  as: "users",
});

// ======================================================
// EXPORT SEMUA MODEL
// ======================================================

module.exports = {
  Product,
  Doctor,
  Grooming,
  Hotel,
  Adoption,
  AnimalCategory,
  Animal,
  AnimalNeed,
  User,
  Role,
  Payment,
  Booking,
  Review,
  Transaction,
};