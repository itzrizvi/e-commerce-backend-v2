// All Requires
const { getAllCategoriesController, getFeaturedCategoriesController } = require("../../controllers")


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
    }
}