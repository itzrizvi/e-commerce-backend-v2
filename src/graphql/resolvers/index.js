// All requires
const { default: GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');
const GraphQLUUID = require('graphql-type-uuid');

const resolvers = {
    JSON: GraphQLJSON,
    Upload: require("graphql-upload-minimal").GraphQLUpload,
    JSONObject: GraphQLJSONObject,
    UUID: GraphQLUUID,
    Query: require('../../operation/query'),
    Mutation: require('../../operation/mutation')
}

module.exports = resolvers;