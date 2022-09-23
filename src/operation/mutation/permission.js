// All Requires
const { assignPermissionController } = require("../../controllers");


// Permission Mutation
module.exports = {
    // Assign Permision To Staff Mutation
    assignPermission: async (root, args, { db, user, isAuth }, info) => {
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized" };
        if (user.role_no === '0') return { message: "Not Authorized" };

        // Return To Controller
        return await assignPermissionController(args.data, db, user, isAuth);
    }
}