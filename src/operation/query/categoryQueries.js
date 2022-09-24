// All Requires
const { getAllCategoriesController } = require("../../controllers")


module.exports = {
    // Query ALL Categories with Childs
    getAllCategories: async (root, args, { db, user, isAuth, TENANT_ID }, info) => {
        // Return to Controller
        return await getAllCategoriesController(db, user, isAuth, TENANT_ID);
    }
}