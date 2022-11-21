// All Requires
const { addShippingMethodController } = require("../../controllers");


// Shipping Method Mutation Start
module.exports = {
    // Add Shipping Method Mutation
    addShippingMethod: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };
        // Send to Controller
        return await addShippingMethodController(args.data, db, user, isAuth, TENANTID);
    },
    // // Add Payment Mutation
    // updatePaymentMethod: async (root, args, { db, user, isAuth, TENANTID }, info) => {
    //     // Return If Not Have TENANT ID
    //     if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
    //     // Return If No Auth
    //     if (!user || !isAuth) return { message: "Not Authorized", status: false };
    //     if (user.has_role === '0') return { message: "Not Authorized", status: false };

    //     // Send to Controller
    //     return await updatePaymentMethodController(args.data, db, user, isAuth, TENANTID);
    // },
}
