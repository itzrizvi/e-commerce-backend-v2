// All Requires
const { Sequelize, DataTypes } = require('sequelize');

// SEQUELIZE CONFIGURATION
const database = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.HOST;

const sequelize = new Sequelize(database, user, password, {
    host: host,
    port: 5000,
    dialect: "postgres",
    pool: {
        max: 50,
        min: 5,
        acquire: 20000,
        idle: 5000
    },
    logging: true
});


// CONNECTION CHECKING
sequelize.authenticate().then(() => {
    console.log("DB CONNECTED")
}).catch((err) => {
    console.log('Unable To Connect: ', err);
});


// DB OBJECT
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Connecting To Model
db.users = require('./User/UserModel')(sequelize, DataTypes);


module.exports = db;