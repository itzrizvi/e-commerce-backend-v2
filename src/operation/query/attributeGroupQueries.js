// ATTR GROUP BASED QUERY
const { getAllAttrGroupController } = require("../../controllers");

// ATTR GROUP QUERIES
module.exports = {
    // GET ALL ATTR GROUPS
    getAllAttrGroups: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };


        // Return To Controller
        return await getAllAttrGroupController(db, user, isAuth, TENANTID);
    },

}