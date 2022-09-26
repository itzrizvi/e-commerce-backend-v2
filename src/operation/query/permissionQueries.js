// All Requires
const { getAllPermissionByStaffController } = require("../../controllers");


module.exports = {
    // GET All Permission By Staff
    getAllPermissionByStaff: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.role_no === '0') return { message: "Not Authorized", status: false };

        // Return TO Controller
        return await getAllPermissionByStaffController(args.query, db, user, isAuth, TENANTID);
    }
}