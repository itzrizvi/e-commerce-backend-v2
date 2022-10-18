// All Requires
const { createCustomerGroupController, updateCustomerGroupController } = require("../../controllers");


// Customer Group BASED Mutation
module.exports = {
    // Create Customer Group
    createCustomerGroup: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };


        // Return To Controller
        return await createCustomerGroupController(args.data, db, user, isAuth, TENANTID);
    },
    // Update Customer Group
    updateCustomerGroup: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };


        // Return To Controller
        return await updateCustomerGroupController(args.data, db, user, isAuth, TENANTID);
    }
}