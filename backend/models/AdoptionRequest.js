const { DataTypes } = require("sequelize"); 
 
const sequelize = require("../config/database"); 
 
const AdoptionRequest = sequelize.define( 
  "AdoptionRequest", 
  { 
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true, 
    }, 
 
    animal_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
    }, 
 
    user_id: { 
      type: DataTypes.INTEGER, 
      allowNull: true, 
    }, 
 
    nama_lengkap: { 
      type: DataTypes.STRING(150), 
      allowNull: false, 
    }, 
 
    nomor_telepon: { 
      type: DataTypes.STRING(30), 
      allowNull: false, 
    }, 
 
    alamat: { 
      type: DataTypes.TEXT, 
      allowNull: false, 
    }, 
 
    alasan_adopsi: { 
      type: DataTypes.TEXT, 
      allowNull: false, 
    }, 
 
    status: { 
      type: DataTypes.ENUM( 
        "pending", 
        "approved", 
        "rejected" 
      ), 
      allowNull: false, 
      defaultValue: "pending", 
    }, 
 
    catatan_admin: { 
      type: DataTypes.TEXT, 
      allowNull: true, 
    }, 
 
    created_at: { 
      type: DataTypes.DATE, 
      allowNull: false, 
      defaultValue: DataTypes.NOW, 
    }, 
 
    updated_at: { 
      type: DataTypes.DATE, 
      allowNull: false, 
      defaultValue: DataTypes.NOW, 
    }, 
  }, 
  { 
    tableName: "adoption_requests", 
 
    timestamps: false, 
 
    underscored: true, 
  } 
); 
 
module.exports = AdoptionRequest; 