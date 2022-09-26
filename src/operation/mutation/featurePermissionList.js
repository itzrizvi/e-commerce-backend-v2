// All Requires
const { createFeaturePermissionListController } = require("../../controllers");


// Feature Permission List Mutations
module.exports = {
    // Create Feature Permission List Mutation
    createFeaturePermission: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        if (!user || !isAuth) return { message: "Not Authorized!!", status: false } // If Not Auth or User
        if (user.role_no === '0') return { message: "Not Authorized", status: false };

        return await createFeaturePermissionListController(args.data, db, user, isAuth, TENANTID);
    }
}