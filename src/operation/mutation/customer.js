const { createCustomerController, addCustomerBillingAddressController, addCustomerShippingAddressController, updateCustomerBillingAddressController, updateCustomerShippingAddressController } = require("../../controllers");

// Customer Mutation Start
module.exports = {
    // Create Customer Mutation
    addCustomer: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };
        // Send to Controller
        return await createCustomerController(args.data, db, user, isAuth, TENANTID);
    },
    // Create Customer Billing Address Mutation
    addCustomerBillingAddress: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };
        // Send to Controller
        return await addCustomerBillingAddressController(args.data, db, user, isAuth, TENANTID);
    },
    // Create Customer Shipping Address Mutation
    addCustomerShippingAddress: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };
        // Send to Controller
        return await addCustomerShippingAddressController(args.data, db, user, isAuth, TENANTID);
    },
    // Update Customer Billing Address Mutation
    updateCustomerBillingAddress: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };
        // Send to Controller
        return await updateCustomerBillingAddressController(args.data, db, user, isAuth, TENANTID);
    },
    // Update Customer Shipping Address Mutation
    updateCustomerShippingAddress: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };
        // Send to Controller
        return await updateCustomerShippingAddressController(args.data, db, user, isAuth, TENANTID);
    }
}