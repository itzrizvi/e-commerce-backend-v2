// All Requires
const { getAllCategoriesController, getFeaturedCategoriesController, getSingleCategoryController } = require("../../controllers")


module.exports = {
    // Query ALL Categories with Childs
    getAllCategories: async (root, args, { db, TENANTID }, info) => {
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return to Controller
        return await getAllCategoriesController(db, TENANTID);
    },
    // GET All Featured Category
    getFeaturedCategories: async (root, args, { db, TENANTID }, info) => {
        // TENANT ID CHECK
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return To Controller
        return await getFeaturedCategoriesController(db, TENANTID);
    },
    // GET All Featured Category
    getSingleCategory: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // TENANT ID CHECK
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return To Controller
        return await getSingleCategoryController(args.query, db, user, isAuth, TENANTID);
    }
}