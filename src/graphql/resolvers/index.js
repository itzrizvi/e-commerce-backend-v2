const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const resolvers = {
    Query: require('../../operation/query'),
    Mutation: require('../../operation/mutation')
}

module.exports = resolvers;