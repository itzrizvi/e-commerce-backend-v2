// All Requires
const { createRolesController, updateRoleController, deleteRoleController } = require("../../controllers");


// Role Mutation Start
module.exports = {
    // Create Role Mutation
    createRoleWithPermission: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.role_no === '0') return { message: "Not Authorized", status: false };
        // Send to Controller
        return await createRolesController(args.data, db, user, isAuth, TENANTID);
    },
    // Update Role Mutation
    updateRole: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.role_no === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await updateRoleController(args.data, db, user, isAuth, TENANTID);
    },
    // Delete Role Mutation
    deleteRole: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.role_no === '0') return { message: "Not Authorized", status: false };

        // Return TO Controller
        return await deleteRoleController(args.data, db, user, isAuth, TENANTID);
    }
}
