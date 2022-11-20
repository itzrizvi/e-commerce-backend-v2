// All Requires
const { addOrderStatusController,
    updateOrderStatusController,
    createOrderByCustomerController,
    createOrderByAdminController,
    updateOrderController,
    orderStatusChangeController,
    orderCancelByCustomerController } = require("../../controllers");


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
    // Create Order By Admin Mutation
    createOrderByAdmin: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await createOrderByAdminController(args.data, db, user, isAuth, TENANTID);
    },
    // Update Order Mutation
    updateOrder: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await updateOrderController(args.data, db, user, isAuth, TENANTID);
    },
    // Order Status Change Mutation
    orderStatusChange: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await orderStatusChangeController(args.data, db, user, isAuth, TENANTID);
    },
    // Order Cancel By Customer
    orderCancelByCustomer: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };

        // Send to Controller
        return await orderCancelByCustomerController(args.data, db, user, isAuth, TENANTID);
    },
}
