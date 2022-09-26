// All Requires
const { createCategoryController } = require("../../controllers");


// Role Mutation Start
module.exports = {
    // Create Category Mutation
    createCategory: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false } // Return if No TENANT ID
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.role_no === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await createCategoryController(args.data, db, user, isAuth, TENANTID);
    }
}
