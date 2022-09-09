const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const resolvers = {
    Query: {
        role: async (parent, args, { db, user, isAuth }, info) => {
            if (!user && !isAuth) return { data: [], isAuth: false, Message: "Not Authenticated", FtechedBy: "" };
            let q = {
                where: args.query
            };
            const getAllRoles = await db.user_roles.findAll(q);

            return {
                data: getAllRoles,
                isAuth: isAuth,
                Message: "Authenticated User",
                FtechedBy: user.email
            }

        }
    },
    Mutation: require('../../operation/mutation')
}

module.exports = resolvers;