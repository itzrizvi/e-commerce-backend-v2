const pg = require('pg');
const Pool = pg.Pool;
const { Client } = require('pg');

//
const database = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.HOST;

const localPoolConfig = {
    user: user,
    password: password,
    host: host,
    port: 5000,
    database: database,
    max: 50,
    min: 5
}

const pool = new Pool(localPoolConfig);
const clientConnect = new Client(localPoolConfig);

module.exports = { pool, clientConnect };