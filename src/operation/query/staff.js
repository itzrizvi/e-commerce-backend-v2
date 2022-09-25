// Stuff BASED QUERY
const { getAllStaffsController } = require('../../controllers');

module.exports = {
    getAllStaff: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", isAuth: false, data: [], status: false };
        if (user.role_no === '0') return { message: "Not Authorized", isAuth: false, data: [], status: false };


        // Return To Controller
        return await getAllStaffsController(db, user, isAuth, TENANTID);

    }
}