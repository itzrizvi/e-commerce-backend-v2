// All Requires
const { getSingleProductController,
    getProductListController,
    getFeaturedProductController,
    getRecentViewProductController,
    publicProductViewController,
    getSingleProductBySlugController,
    getProductsByIDsController
} = require("../../controllers")


module.exports = {
    // GET Single Product Query
    getSingleProduct: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false } // Return if No TENANT ID
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return to Controller
        return await getSingleProductController(args.query, db, TENANTID);
    },
    // GET Single Product By Slug Query
    getSingleProductBySlug: async (root, args, { db, TENANTID }, info) => {
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false } // Return if No TENANT ID

        // Return to Controller
        return await getSingleProductBySlugController(args.query, db, TENANTID);
    },
    // GET Product List
    getProductList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false } // Return if No TENANT ID
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getProductListController(db, user, TENANTID);
    },
    // GET Featured Products
    getFeaturedProducts: async (root, args, { db, TENANTID }, info) => {
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false } // Return if No TENANT ID

        // Return To Controller
        return await getFeaturedProductController(db, TENANTID);
    },
    getRecentViewProduct: async (root, args, { db, user, isAuth, TENANTID }, info) => {

        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false } // Return if No TENANT ID

        // Return To Controller
        return await getRecentViewProductController(args.query, db, user, isAuth, TENANTID, ip);
    },
    // GET Single Product Query
    publicProductView: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false } // Return if No TENANT ID

        // Return to Controller
        return await publicProductViewController(args.query, db, TENANTID);
    },
    // GET Products By IDS
    getProductsByIDs: async (root, args, { db, TENANTID }, info) => {
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false } // Return if No TENANT ID

        // Return To Controller
        return await getProductsByIDsController(args.query, db, TENANTID);
    }
}