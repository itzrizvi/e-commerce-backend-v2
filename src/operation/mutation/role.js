// All Requires
const { createRolesController } = require("../../controllers");


// Role Mutation Start
module.exports = {
    createRole: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.role_no === '0') return { message: "Not Authorized", status: false };
        // Send to Controller
        return await createRolesController(args.data, db, user, isAuth, TENANTID);
    }
}
