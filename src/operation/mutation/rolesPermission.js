// All Requires
const { createRolesPermissionController } = require("../../controllers");


// Feature Permission List Mutations
module.exports = {
    // Create Roles Permission List Mutation
    createRolesPermission: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        if (!user || !isAuth) return { message: "Not Authorized!!", status: false } // If Not Auth or User
        if (user.role_no === '0') return { message: "Not Authorized", status: false };

        return await createRolesPermissionController(args.data, db, user, isAuth, TENANTID);
    }
}