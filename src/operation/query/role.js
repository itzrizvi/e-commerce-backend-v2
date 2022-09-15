// ROLE BASED QUERY
const { getAllRolesController } = require('../../controllers');

module.exports = {
    getAllRoles: async (parent, args, { db, user, isAuth }, info) => {

        return await getAllRolesController(args.query, db, user, isAuth);

    }
}