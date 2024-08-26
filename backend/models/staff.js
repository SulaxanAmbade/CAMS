const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Staff = sequelize.define('Staff', {
    StaffId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ContactNo: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Staff;
