//importing modules
const { Sequelize, DataTypes } = require('sequelize')

//Database connection with dialect of postgres specifying the database we are using
//port for my database is 5433
//database name is discover

// DB CONFIGS
const database = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.HOST;


const sequelize = new Sequelize(database, user, password, {
    host: host,
    dialect: "postgres",
    pool: {
        max: 50,
        min: 5,
        acquire: 30000,
        idle: 10000
    },
    port: 5000,
    logging: false
})

//checking if connection is done
sequelize.authenticate().then(() => {
    console.log(`DATABASE CONNECTED`)
}).catch((err) => {
    console.log(err)
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

//connecting to model
db.users = require('./User')(sequelize, DataTypes);

//exporting the module
module.exports = db