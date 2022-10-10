// Stuff BASED QUERY
const { getAllStaffsController, getSingleAdminController } = require('../../controllers');

// STAFF QUERIES
module.exports = {
    // GET ALL STAFF
    getAllStaff: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", isAuth: false, data: [], status: false };
        if (user.has_role === '0') return { message: "Not Authorized", isAuth: false, data: [], status: false };


        // Return To Controller
        return await getAllStaffsController(db, user, isAuth, TENANTID);
    },
    // GET SINGLE STAFF/ADMIN
    getSingleAdmin: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };


        // Return To Controller
        return await getSingleAdminController(args.query, db, user, isAuth, TENANTID);
    },
}