const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Patient = require('./patient');
const Doctor = require('./doctor');

const Appointment = sequelize.define('Appointment', {
  AppointmentId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  PatientId: {
    type: DataTypes.INTEGER,
    references: {
      model: Patient,
      key: 'PatientId'
    }
  },
  DoctorId: {
    type: DataTypes.INTEGER,
    references: {
      model: Doctor,
      key: 'DoctorId'
    }
  },
  TimeSlot: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Status: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Patient.hasMany(Appointment, { foreignKey: 'PatientId' });
Doctor.hasMany(Appointment, { foreignKey: 'DoctorId' });
Appointment.belongsTo(Patient, { foreignKey: 'PatientId' });
Appointment.belongsTo(Doctor, { foreignKey: 'DoctorId' });

module.exports = Appointment;
