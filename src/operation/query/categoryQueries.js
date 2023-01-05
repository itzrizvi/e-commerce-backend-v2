// All Requires
const { getAllCategoriesController,
    getFeaturedCategoriesController,
    getSingleCategoryController,
    getParentCategoriesController,
    getParentChildCategoriesController,
    getProductsByCategoryController,
    getProductsByCategorySlugController } = require("../../controllers")


module.exports = {
    // Query ALL Categories with Childs
    getAllCategories: async (root, args, { db, TENANTID }, info) => {
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return to Controller
        return await getAllCategoriesController(db, TENANTID);
    },
    // GET All Featured Category
    getFeaturedCategories: async (root, args, { db, TENANTID }, info) => {
        // TENANT ID CHECK
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return To Controller
        return await getFeaturedCategoriesController(db, TENANTID);
    },
    // GET Products By Category
    getProductsByCategory: async (root, args, { db, TENANTID }, info) => {
        // TENANT ID CHECK
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return To Controller
        return await getProductsByCategoryController(args.query, db, TENANTID);
    },
    // GET Products By Category Slug
    getProductsByCategorySlug: async (root, args, { db, TENANTID }, info) => {
        // TENANT ID CHECK
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return To Controller
        return await getProductsByCategorySlugController(args.query, db, TENANTID);
    },
    // GET All Featured Category
    getSingleCategory: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // TENANT ID CHECK
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return To Controller
        return await getSingleCategoryController(args.query, db, user, isAuth, TENANTID);
    },
    // GET Parent Categories
    getParentCategories: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // TENANT ID CHECK
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return To Controller
        return await getParentCategoriesController(db, user, isAuth, TENANTID);
    },
    // GET Parent and a Child Categories
    getParentChildCategories: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // TENANT ID CHECK
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return To Controller
        return await getParentChildCategoriesController(db, user, isAuth, TENANTID);
    }
}