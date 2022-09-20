// ROLE BASED QUERY
const { getAllRolesController } = require('../../controllers');

module.exports = {
    getAllRoles: async (root, args, { db, user, isAuth }, info) => {
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", isAuth: false, data: [] };
        if (user.role_no === '0') return { message: "Not Authorized", isAuth: false, data: [] };

        // Return To Controller
        return await getAllRolesController(db, user, isAuth);

    }
}