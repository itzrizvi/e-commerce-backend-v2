const { createVendorController,
    updateVendorController,
    updateVendorStatusController,
    addVendorBillingAddressController,
    addVendorShippingAddressController,
    updateVendorAddressController,
    createContactPersonController,
    updateContactPersonController } = require("../../controllers");

// Role Mutation Start
module.exports = {
    // Create Role Mutation
    createVendor: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };
        // Send to Controller
        return await createVendorController(args.data, db, user, isAuth, TENANTID);
    },
    updateVendor: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await updateVendorController(args.data, db, user, isAuth, TENANTID);
    },
    updateVendorStatus: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await updateVendorStatusController(args.data, db, user, isAuth, TENANTID);
    },
    // Create Vendor Billing Address Mutation
    addVendorBillingAddress: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };
        // Send to Controller
        return await addVendorBillingAddressController(args.data, db, user, isAuth, TENANTID);
    },
    // Create Vendor Shipping Address Mutation
    addVendorShippingAddress: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };
        // Send to Controller
        return await addVendorShippingAddressController(args.data, db, user, isAuth, TENANTID);
    },
    // Update Vendor Address Mutation
    updateVendorAddress: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };
        // Send to Controller
        return await updateVendorAddressController(args.data, db, user, isAuth, TENANTID);
    },
    // Create Contact Person
    createContactPerson: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.id != args.data.ref_id) {
            if (user.has_role === '0') return { message: "Not Authorized", status: false };
        }
        // Send to Controller
        return await createContactPersonController(args.data, db, user, isAuth, TENANTID);
    },
    // Update Contact Person
    updateContactPerson: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.id != args.data.ref_id) {
            if (user.has_role === '0') return { message: "Not Authorized", status: false };
        }
        // Send to Controller
        return await updateContactPersonController(args.data, db, user, isAuth, TENANTID);
    },
}
