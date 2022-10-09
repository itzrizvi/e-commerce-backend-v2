// All Requires
const { createRolesPermissionController, updateRolesPermissionController } = require("../../controllers");


// Feature Permission List Mutations
module.exports = {
    // Create Roles Permission Mutation
    createRolesPermission: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        if (!user || !isAuth) return { message: "Not Authorized!!", status: false } // If Not Auth or User
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await createRolesPermissionController(args.data, db, user, isAuth, TENANTID);
    },
    // Update Roles Permission Mutation
    updateRolesPermission: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        if (!user || !isAuth) return { message: "Not Authorized!!", status: false } // If Not Auth or User
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await updateRolesPermissionController(args.data, db, user, isAuth, TENANTID);
    }
}