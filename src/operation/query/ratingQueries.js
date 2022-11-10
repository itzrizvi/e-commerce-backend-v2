// ROLE BASED QUERY
const { getAllRatingByUserController,
    getAllRatingByProductController,
    getSingleRatingController,
    getTopRatedProductsController } = require("../../controllers");

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
}