// All requires
const { default: GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');
const GraphQLUUID = require('graphql-type-uuid');
// const { GraphQLUpload } = require('graphql-upload');

const resolvers = {
    JSON: GraphQLJSON,
    // Upload: GraphQLUpload,
    JSONObject: GraphQLJSONObject,
    UUID: GraphQLUUID,
    Query: require('../../operation/query'),
    Mutation: require('../../operation/mutation')
}

module.exports = resolvers;