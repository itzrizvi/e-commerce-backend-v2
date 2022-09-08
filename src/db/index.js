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
const database = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.HOST;

const db = {}
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
});


// loading all sequelize models from the 'models' folder
readdirSync(path.join(__dirname, './Models'))
    .filter(file => file.indexOf('.') !== 0 && file !== baseName && file.slice(-3) === '.js')
    .forEach(file => {
        const model = require(path.join(__dirname, './Models', file))(sequelize, DataTypes);
        db[model.name] = model;

    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});


db.sequelize = sequelize
db.Sequelize = Sequelize




//////////////////////////////////////////////////////////////////////
let constructResponse = function async(data, error) {
    return {
        count: data ? data.length : 0,
        data: data,
        error: error ? (error.name ? error.name : error) : null
    }
}

db.getUser = async (request) => {
    console.log("getUser called")
    let q = {
        where: request.query
    };
    return db.users.findAll(q)
        .then(res => constructResponse(res))
}


db.createUser = async (request) => {
    console.log("createUser called")
    return db.users.create(request.data).then(res => constructResponse(res))
}


//exporting the module
module.exports = db