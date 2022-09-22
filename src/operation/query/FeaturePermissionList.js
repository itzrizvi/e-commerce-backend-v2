// Permission BASED QUERY
const { getAllFeaturePermissionListController } = require("../../controllers");

module.exports = {
    getAllFeaturePermission: async (root, args, { db, user, isAuth }, info) => {
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", isAuth: false, data: [] };
        if (user.role_no === '0') return { message: "Not Authorized", isAuth: false, data: [] };

        // Return To Controller
        return await getAllFeaturePermissionListController(db, user, isAuth);

    }
}