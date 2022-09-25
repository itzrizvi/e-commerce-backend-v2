// All Requires
const { getAllCategoriesController } = require("../../controllers")


module.exports = {
    // Query ALL Categories with Childs
    getAllCategories: async (root, args, { db, TENANT_ID }, info) => {
        if (!TENANT_ID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return to Controller
        return await getAllCategoriesController(db, TENANT_ID);
    }
}