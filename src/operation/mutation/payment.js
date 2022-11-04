// All Requires
const { addPaymentMethodController } = require("../../controllers");


// Payment Mutation Start
module.exports = {
    // Add Payment Mutation
    addPaymentMethod: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };

        // Send to Controller
        return await addPaymentMethodController(args.data, db, user, isAuth, TENANTID);
    }
}
