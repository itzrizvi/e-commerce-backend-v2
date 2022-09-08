

const resolvers = {
    Query: {
        user: (parent, args, { db }, info) => db.getUser(args, info),
        role: async (parent, args, { db }, info) => {
            let q = {
                where: args.query
            };
            const getAllRoles = await db.user_roles.findAll(q);

            return {
                data: getAllRoles
            }

        }
    },
    Mutation: {
        createUser: (parent, args, { db }, info) => { db.createUser(args, info) },
        createRole: async (parent, args, { db }, info) => {
            const newRole = await db.user_roles.create(args.data);
            console.log(newRole.role)
            return {
                uid: newRole.uid,
                role: newRole.role
            }
        }
    }
}

module.exports = resolvers;