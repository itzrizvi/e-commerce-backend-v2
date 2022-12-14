// ROLE BASED QUERY
const { getAllRatingByUserController,
    getAllRatingByProductController,
    getSingleRatingController,
    getTopRatedProductsController,
    getRatingsByUserIDController } = require("../../controllers");

module.exports = {
    // GET ALL ROLES QUERY
    getAllRatingByUser: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return To Controller
        return await getAllRatingByUserController(db, user, isAuth, TENANTID);
    },
    getAllRatingByProduct: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return To Controller
        return await getAllRatingByProductController(args.query, db, user, isAuth, TENANTID);
    },
    getSingleRating: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return To Controller
        return await getSingleRatingController(args.query, db, user, isAuth, TENANTID);
    },
    getTopRatedProducts: async (root, args, { db, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return To Controller
        return await getTopRatedProductsController(db, TENANTID);
    },
    // GET Ratings By User ID For Admin
    getRatingsByUserID: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getRatingsByUserIDController(args.query, db, user, isAuth, TENANTID);
    },
}