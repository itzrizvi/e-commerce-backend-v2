// ALL REQUIRES
require('dotenv').config();
const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000;
const CryptoJS = require('crypto-js');
const db = require('./src/db');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./src/graphql/typeDefs/schema');
const resolvers = require('./src/graphql/resolvers');
const { ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageDisabled } = require('apollo-server-core'); // FOR DISABLING APOLLO STUDIO ONLY
const { graphqlUploadExpress } = require("graphql-upload-minimal");
const { getFileStream } = require('./src/utils/fileUpload');

// CREATE SERVER APP
const app = express();

// Middlewares Require
const onReqTokenGenerate = require('./src/middlewares/onReqTokenGenerator');
const onReqTenantCheck = require('./src/middlewares/onReqTenantCheckMiddleware');


// MIDDLWARES ARRAY
const middlewares = [
    express.urlencoded({ extended: true }),
    express.json(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    cors(),
    cookieParser(),
];

app.use(middlewares); // Middlewares Using
app.use(onReqTokenGenerate)
app.use(onReqTenantCheck)

// Get file from aws
app.get('/images/*', getFileStream)


// //
// // Encrypt
// let myID = '9487253';
// var ciphertext = CryptoJS.AES.encrypt(myID, process.env.secretKey).toString();

// // Decrypt
// var bytes = CryptoJS.AES.decrypt(ciphertext, process.env.secretKey);
// var originalText = bytes.toString(CryptoJS.enc.Utf8);

// APOLLO SERVER STARTS
async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs: typeDefs,
        resolvers: resolvers,
        csrfPrevention: false,
        uploads: true,
        playground: true,
        introspection: true,
        tracing: true,
        context: ({ req }) => {
            let { isAuth, user, TENANTID } = req;
            return {
                req,
                isAuth,
                user,
                db,
                TENANTID
            }
        },
        cache: 'bounded',
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground(), // FOR DISABLE Apollo STUDIO
            ApolloServerPluginLandingPageDisabled() // FOR DISABLE Apollo STUDIO
        ]

    });
    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
    await server.start();
    server.applyMiddleware({ app });
    app.use((req, res) => {
        res.status(200);
        res.send('Hello FROM PRIME SERVER PARTS!!!🚀🚀');
        res.end();
    });

    await new Promise(resolve => app.listen({ port }, resolve));

    // LISTEN APP
    console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
    return { server, app };
}
startApolloServer();




// DB RESYNC
db.sequelize.sync({ force: false }).then(() => {
    console.log("DB HAS BEEN RESYNC")
})




