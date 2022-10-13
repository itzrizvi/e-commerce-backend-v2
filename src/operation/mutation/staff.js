// All Requires
const { updateAdminController, adminPasswordChangeController } = require("../../controllers");


// Stuff/Admin BASED Mutation
module.exports = {
    // Admin/Staff Update
    adminUpdate: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Merging File To Args Data
        args.data.image = args.file;

        // Return To Controller
        return await updateAdminController(args.data, db, user, isAuth, TENANTID);
    },
    // Admin Password Change
    adminPasswordChange: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await adminPasswordChangeController(args.data, db, user, isAuth, TENANTID);
    }
}