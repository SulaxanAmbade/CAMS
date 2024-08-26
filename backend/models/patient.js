const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Patient = sequelize.define('Patient', {
  PatientId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  DateofBirth: {
    type: DataTypes.DATEONLY,
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

module.exports = Patient;
