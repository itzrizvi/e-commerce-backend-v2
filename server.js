// ALL REQUIRES
require('dotenv').config();
const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000;
const CryptoJS = require('crypto-js');
const db = require('./src/db');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');



//
const SequelizeStore = require("connect-session-sequelize")(expressSession.Store);

// CREATE SERVER APP
const app = express();

// ROUTE IMPORTS
const authRoute = require('./src/Routes/AuthRoute/authRoute');


// IMPORT MIDDLEWARES
const bindUserWithRequest = require('./src/Middlewares/verifyAuth');
const { schemaWithResolvers } = require('./src/graphql');



// MIDDLWARES ARRAY
const middlewares = [
    express.urlencoded({ extended: true }),
    express.json(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    // helmet(),
    cors(),
    cookieParser(),
    expressSession({
        store: new SequelizeStore({
            db: db.sequelize,         // Connection pool
            tableName: 'sessions'   // Use another table-name than the default "session" one
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true }
    }),
    bindUserWithRequest,
];

app.use(middlewares); // Middlewares Using

// ROUTE DECLARATION
app.use('/api/users', authRoute);


// ROOT API
app.get('/', (req, res) => {
    res.send('HELLO FROM PRIME SERVER PARTS ❤️‍🔥');
});


// TESTAPI
app.get('/rizvi', (req, res) => { // TEST API

    if (req.user) {
        res.json({ "message": `Hi ${req.user.first_name}..!!` })
    } else {
        res.json({ "message": "You are not allowed!!!" })
    }
});


// //
// // Encrypt
// let myID = '9487253';
// var ciphertext = CryptoJS.AES.encrypt(myID, process.env.secretKey).toString();

// // Decrypt
// var bytes = CryptoJS.AES.decrypt(ciphertext, process.env.secretKey);
// var originalText = bytes.toString(CryptoJS.enc.Utf8);

// console.log('MY ID: ', originalText); // 'my message'
// console.log('MY ID ENC : ', ciphertext); // 'my message'



let apolloServer = null;
async function startServer() {
    apolloServer = new ApolloServer({
        schema: schemaWithResolvers,
        uploads: true,
        playground: true,
        introspection: true,
        tracing: true,
        context: { db }
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' });
}
startServer();

const server = createServer(app);



// DB CONNECT AND LISTEN SERVER
db.sequelize.sync({ force: false }).then(() => {
    // LISTEN APP
    server.listen({ port }, () => console.log(
        `🚀 Server ready at http://localhost:${port}/graphql`,
    ));
    console.log("DB HAS BEEN RESYNC")
})




