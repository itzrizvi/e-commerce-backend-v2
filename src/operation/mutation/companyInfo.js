const { companyInfoController,
    addCompanyBillingAddressController,
    addCompanyShippingAddressController,
    updateCompanyAddressController } = require("../../controllers");

module.exports = {
    // Company Info Mutation
    companyInfo: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };
        // Return To Controller
        return await companyInfoController(args.data, db, user, isAuth, TENANTID);
    },
    // Company Billing Address Mutation
    addCompanyBillingAddress: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };
        // Return To Controller
        return await addCompanyBillingAddressController(args.data, db, user, isAuth, TENANTID);
    },
    // Company Shipping Address Mutation
    addCompanyShippingAddress: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };
        // Return To Controller
        return await addCompanyShippingAddressController(args.data, db, user, isAuth, TENANTID);
    },
    // Update Company Address Mutation
    updateCompanyAddress: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };
        // Return To Controller
        return await updateCompanyAddressController(args.data, db, user, isAuth, TENANTID);
    },

}