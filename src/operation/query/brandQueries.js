// BARND BASED QUERY
const { getAllBrandsController, getSingleBrandController } = require("../../controllers");

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
    // GET SINGLE BRAND
    getSingleBrand: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };


        // Return To Controller
        return await getSingleBrandController(args.query, db, user, isAuth, TENANTID);
    },
    // GET PRODUCTS BY BRAND
    getProductsByBrand: async (root, args, { db, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth

        // Return To Controller
        // return await getSingleBrandController(args.query, db, TENANTID);
    },

}