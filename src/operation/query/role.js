// ROLE BASED QUERY
const { getAllRolesController, getSingleRoleController } = require('../../controllers');

module.exports = {
    // GET ALL ROLES QUERY
    getAllRoles: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.role_no === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getAllRolesController(db, user, isAuth, TENANTID);

    },
    // GET SINGLE ROLE QUERY
    getSingleRole: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.role_no === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getSingleRoleController(args.query, db, user, isAuth, TENANTID);

    }
}