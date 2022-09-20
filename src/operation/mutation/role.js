// All Requires
const { createRolesController } = require("../../controllers");


// Role Mutation Start
module.exports = {
    createRole: async (root, args, { db, user, isAuth }, info) => {
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", roleNo: 00, role: "No Role", roleUUID: "No UUID", roleSlug: "No Slug" };
        if (user.role_no === '0') return { message: "Not Authorized", roleNo: 00, role: "No Role", roleUUID: "No UUID", roleSlug: "No Slug" };
        // Send to Controller
        return await createRolesController(args.data, db, user, isAuth);
    }
}
