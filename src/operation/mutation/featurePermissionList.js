// All Requires
const { createFeaturePermissionListController } = require("../../controllers");


// Feature Permission List Mutations
module.exports = {
    // Create Feature Permission List Mutation
    createFeaturePermission: async (root, args, { db, user, isAuth }, info) => {
        if (!user || !isAuth) return { featureNameUUID: "Null", message: "Not Authorized!!" } // If Not Auth or User

        return await createFeaturePermissionListController(args.data, db, user, isAuth);
    }
}