// BARND BASED QUERY
const { getAllBrandsController } = require("../../controllers");

// BARND QUERIES
module.exports = {
    // GET ALL BARNDS
    getAllBrands: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };


        // Return To Controller
        return await getAllBrandsController(db, user, isAuth, TENANTID);
    },

}