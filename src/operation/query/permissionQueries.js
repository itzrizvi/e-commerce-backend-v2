// All Requires
const { getAllPermissionByStaffController } = require("../../controllers");


module.exports = {
    // GET All Permission By Staff
    getAllPermissionByStaff: async (root, args, { db, user, isAuth }, info) => {
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", isAuth: false };
        if (user.role_no === '0') return { message: "Not Authorized", isAuth: false };

        // Return TO Controller
        return await getAllPermissionByStaffController(args.query, db, user, isAuth);
    }
}