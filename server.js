// ALL REQUIRES
require("dotenv").config();
const express = require("express");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;
const db = require("./src/db");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./src/graphql/typeDefs/schema");
const resolvers = require("./src/graphql/resolvers");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} = require("apollo-server-core"); // FOR DISABLING APOLLO STUDIO ONLY
const { graphqlUploadExpress } = require("graphql-upload-minimal");
const { getFileStream } = require("./src/utils/fileUpload");
const { getCustomFileStream } = require("./src/utils/fileUpload");
const path = require("path");
const rateLimit = require('express-rate-limit')

// CREATE SERVER APP
const app = express();

// Middlewares Require
const onReqTokenGenerate = require("./src/middlewares/onReqTokenGenerator");
const onReqTenantCheck = require("./src/middlewares/onReqTenantCheckMiddleware");

// MIDDLWARES ARRAY
const middlewares = [
  express.urlencoded({ extended: true, limit: "50mb", parameterLimit: 100000 }),
  express.json({ limit: "50mb" }),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  cors(),
  cookieParser(),
];
const apiLimiter = rateLimit({
  windowMs: 1000 * 60 * 1, // 1 minute
  max: 60, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(middlewares); // Middlewares Using
// Apply the rate limiting middleware to API calls only
app.use('/graphql', apiLimiter)
app.use(onReqTokenGenerate);
app.use(onReqTenantCheck);
app.set("trust proxy", true);

// Get file from aws
app.get("/images/*", getFileStream);
app.get("/files/*", getCustomFileStream);
app.use("/media", express.static(path.join(__dirname, "media")));

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
      let { isAuth, user, TENANTID, ip, headers } = req;
      return {
        req,
        isAuth,
        user,
        db,
        TENANTID,
        ip,
        headers,
      };
    },
    cache: "bounded",
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(), // FOR DISABLE Apollo STUDIO
      ApolloServerPluginLandingPageDisabled(), // FOR DISABLE Apollo STUDIO
    ],
  });
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  await server.start();
  server.applyMiddleware({ app });
  app.use((req, res) => {
    res.status(200);
    res.send("Hello FROM PRIME SERVER PARTS!!!🚀🚀");
    res.end();
  });

  await new Promise((resolve) => app.listen({ port }, resolve));

  // LISTEN APP
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
  return { server, app };
}
startApolloServer();

// DB RESYNC
db.sequelize.sync({ force: false }).then(() => {
  console.log("DB HAS BEEN RESYNC");
});
