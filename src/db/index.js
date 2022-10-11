//importing modules
const { Sequelize, DataTypes } = require('sequelize');
const { readdirSync } = require('fs');
const { basename } = require('path');
const path = require('path');
const baseName = basename(__filename);
//Database connection with dialect of postgres specifying the database we are using
//port for my database is 5433
//database name is discover
// DB CONFIGS
// const database = process.env.DB_NAME;
// const user = process.env.DB_USER;
// const password = process.env.DB_PASS;
// const host = process.env.HOST;
// const port = process.env.DB_PORT
const database = process.env.RDS_DB_NAME;
const user = process.env.RDS_USERNAME;
const password = process.env.RDS_PASSWORD;
const host = process.env.RDS_HOSTNAME;
const port = process.env.RDS_PORT

const db = {}
const sequelize = new Sequelize(database, user, password, {
    host: host,
    dialect: "postgres",
    pool: {
        max: 50,
        min: 5,
        acquire: 30000,
        idle: 600000
    },
    port: port,
    logging: false
})

//checking if connection is done
sequelize.authenticate().then(() => {
    console.log(`DATABASE CONNECTED`)
}).catch((err) => {
    console.log(err)
});


// loading all sequelize models from the 'models' folder
readdirSync(path.join(__dirname, './Models'))
    .filter(file => file.indexOf('.') !== 0 && file !== baseName && file.slice(-3) === '.js')
    .forEach(file => {
        const model = require(path.join(__dirname, './Models', file))(sequelize, DataTypes);
        db[model.name] = model;
        if (db[model.name].associate) {
            db[model.name].associate(db);
        }

    });


db.sequelize = sequelize
db.Sequelize = Sequelize


//exporting the module
module.exports = db