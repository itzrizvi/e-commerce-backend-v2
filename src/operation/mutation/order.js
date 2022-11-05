// All Requires
const { addOrderStatusController,
    updateOrderStatusController,
    createOrderByCustomerController } = require("../../controllers");


// Order Mutation Start
module.exports = {
    // Add Order Status Mutation
    addOrderStatus: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await addOrderStatusController(args.data, db, user, isAuth, TENANTID);
    },
    // Update Order Status Mutation
    updateOrderStatus: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await updateOrderStatusController(args.data, db, user, isAuth, TENANTID);
    },
    // Create Order By Customer Mutation
    createOrderByCustomer: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };

        // Send to Controller
        return await createOrderByCustomerController(args.data, db, user, isAuth, TENANTID);
    },
}
