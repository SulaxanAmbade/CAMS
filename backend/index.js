const sequelize = require('./config/db');

const Patient = require('./models/patient');
const Doctor = require('./models/doctor');
const Staff = require('./models/staff');
const Appointment = require('./models/appointment');

sequelize.sync({ force: false })
    .then(() => {
        console.log('Database & tables created!');
    });

module.exports = {
    Patient,
    Doctor,
    Staff,
    Appointment
};
