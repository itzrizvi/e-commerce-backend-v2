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
const typeDefs = require('./src/graphql/typeDefs/schema');
const resolvers = require('./src/graphql/resolvers');


//
const SequelizeStore = require("connect-session-sequelize")(expressSession.Store);

// CREATE SERVER APP
const app = express();

// Middlewares Require
const onReqTokenGenerate = require('./src/middlewares/onReqTokenGenerator');


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
];

app.use(middlewares); // Middlewares Using
app.use(onReqTokenGenerate)


// //
// // Encrypt
// let myID = '9487253';
// var ciphertext = CryptoJS.AES.encrypt(myID, process.env.secretKey).toString();

// // Decrypt
// var bytes = CryptoJS.AES.decrypt(ciphertext, process.env.secretKey);
// var originalText = bytes.toString(CryptoJS.enc.Utf8);

// console.log('MY ID: ', originalText); // 'my message'
// console.log('MY ID ENC : ', ciphertext); // 'my message'



async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs: typeDefs,
        resolvers: resolvers,
        csrfPrevention: true,
        uploads: true,
        playground: true,
        introspection: true,
        tracing: true,
        context: ({ req }) => {
            let { isAuth, user } = req;
            return {
                req,
                isAuth,
                user,
                db
            }
        },
        cache: 'bounded',

    });
    await server.start();

    server.applyMiddleware({ app });
    app.use((req, res) => {
        res.status(200);
        res.send('Hello FROM PRIME SERVER PARTS!');
        res.end();
    });
    await new Promise(resolve => app.listen({ port }, resolve));
    console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
    return { server, app };
}
startApolloServer();




// DB CONNECT AND LISTEN SERVER
db.sequelize.sync({ force: false }).then(() => {
    // LISTEN APP

    console.log("DB HAS BEEN RESYNC")
})




