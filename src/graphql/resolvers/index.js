const bcrypt = require('bcrypt');
const { default: GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');
const GraphQLUUID = require('graphql-type-uuid');
const jwt = require('jsonwebtoken');

const resolvers = {
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
    UUID: GraphQLUUID,
    Query: require('../../operation/query'),
    Mutation: require('../../operation/mutation')
}

module.exports = resolvers;