// All Requires
const { getAllCategoriesController } = require("../../controllers")


module.exports = {
    // Query ALL Categories with Childs
    getAllCategories: async (root, args, { db, TENANTID }, info) => {
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return to Controller
        return await getAllCategoriesController(db, TENANTID);
    }
}