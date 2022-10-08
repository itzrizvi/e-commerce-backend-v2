// Permission BASED QUERY
const { getAllRolesPermissionController, getSingleRolesPermissionController } = require("../../controllers");

// Roles Permission Queries
module.exports = {
    // Get All Roles Permission Query
    getAllRolesPermission: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.role_no === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getAllRolesPermissionController(db, user, isAuth, TENANTID);

    },
    // Get Single Role Permission Query
    getSingleRolesPermission: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.role_no === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getSingleRolesPermissionController(args.query, db, user, isAuth, TENANTID);
    }
}