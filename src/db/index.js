//importing modules
const { Sequelize, DataTypes } = require("sequelize");
const { readdirSync } = require("fs");
const { basename } = require("path");
const path = require("path");
const baseName = basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/config/config.json")[env];
const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    // pool: {
    //     max: 50,
    //     min: 5,
    //     acquire: 30000,
    //     idle: 10000,
    //     evict: 600000
    // },
    port: config.port,
    logging: false,
  }
);

//checking if connection is done
sequelize
  .authenticate()
  .then(() => {
    console.log(`DATABASE CONNECTED`);
  })
  .catch((err) => {
    console.log(err);
  });

// loading all sequelize models from the 'models' folder
readdirSync(path.join(__dirname, "./Models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== baseName && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, "./Models", file))(
      sequelize,
      DataTypes
    );
    db[model.name] = model;
    if (db[model.name].associate) {
      db[model.name].associate(db);
    }
  });

db.sequelize = sequelize;

//exporting the module
module.exports = db;
