// BANNER BASED QUERY
const { getSingleBannerController, getAllBannersController, getBannerBySlugController } = require("../../controllers");

// BANNER QUERIES
module.exports = {
    // GET SINGLE BANNER
    getSingleBanner: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getSingleBannerController(args.query, db, user, isAuth, TENANTID);
    },
    // GET All Banners
    getAllBanners: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getAllBannersController(db, user, isAuth, TENANTID);
    },
    getBannerBySlug: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return To Controller
        return await getBannerBySlugController(args.query, db, user, isAuth, TENANTID);
    }

}