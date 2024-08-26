const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Doctor = sequelize.define('Doctor', {
  DoctorId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Specialty: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ContactNo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = Doctor;
