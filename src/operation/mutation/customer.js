const { createCustomerController,
    addCustomerBillingAddressController,
    addCustomerShippingAddressController,
    updateCustomerAddressController,
    addCustomerSingleBillingAddressController,
    addCustomerSingleShippingAddressController,
    updateCustomerSingleAddressController,
    updateCustomerController } = require("../../controllers");

// Customer Mutation Start
module.exports = {
    // Create Customer Mutation
    addCustomer: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };
        // Send to Controller
        return await createCustomerController(args.data, db, user, isAuth, TENANTID);
    },
    // Create Customer Billing Address Mutation
    addCustomerBillingAddress: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        // Send to Controller
        return await addCustomerBillingAddressController(args.data, db, user, isAuth, TENANTID);
    },
    // Create Customer Shipping Address Mutation
    addCustomerShippingAddress: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        // Send to Controller
        return await addCustomerShippingAddressController(args.data, db, user, isAuth, TENANTID);
    },
    // Update Customer Address Mutation
    updateCustomerAddress: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        // Send to Controller
        return await updateCustomerAddressController(args.data, db, user, isAuth, TENANTID);
    },
    // Create Customer Single Billing Address Mutation
    addCustomerSingleBillingAddress: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        // Send to Controller
        return await addCustomerSingleBillingAddressController(args.data, db, user, isAuth, TENANTID);
    },
    // Create Customer Single Shipping Address Mutation
    addCustomerSingleShippingAddress: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        // Send to Controller
        return await addCustomerSingleShippingAddressController(args.data, db, user, isAuth, TENANTID);
    },
    // Update Customer Single Address Mutation
    updateCustomerSingleAddress: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        // Send to Controller
        return await updateCustomerSingleAddressController(args.data, db, user, isAuth, TENANTID);
    },
    // Update Customer Mutation
    updateCustomer: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };
        // Send to Controller
        return await updateCustomerController(args.data, db, user, isAuth, TENANTID);
    },
}
