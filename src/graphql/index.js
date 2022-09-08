const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");
const { loadSchemaSync } = require("@graphql-tools/load");
const { addResolversToSchema } = require("@graphql-tools/schema");
const resolvers = require('./resolvers');
const { join } = require('path');


const schema = loadSchemaSync(join(__dirname, './typeDefs'), { loaders: [new GraphQLFileLoader()] });



exports.schemaWithResolvers = addResolversToSchema({
    schema,
    resolvers
})