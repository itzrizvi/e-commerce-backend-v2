// All Requires
const { addPaymentMethodController, updatePaymentMethodController } = require("../../controllers");


// Payment Mutation Start
module.exports = {
    // Add Payment Mutation
    addPaymentMethod: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };
        // Send to Controller
        return await addPaymentMethodController(args.data, db, user, isAuth, TENANTID);
    },
    // Add Payment Mutation
    updatePaymentMethod: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await updatePaymentMethodController(args.data, db, user, isAuth, TENANTID);
    },
}
