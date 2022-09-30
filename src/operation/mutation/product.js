// All Requires
const { addProductController } = require("../../controllers");


// Role Mutation Start
module.exports = {
    // Create Category Mutation
    addProduct: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false } // Return if No TENANT ID
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.role_no === '0') return { message: "Not Authorized", status: false };

        return await addProductController(args.data, db, user, isAuth, TENANTID);

    }
}
