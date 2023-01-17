// Vendor BASED QUERY

const { getAllVendorController,
    getSingleVendorController,
    getSearchedVendorsController,
    getContactPersonController } = require("../../controllers");

module.exports = {
    // GET ALL Vendor QUERY
    getAllVendor: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return To Controller
        return await getAllVendorController(db, user, isAuth, TENANTID);
    },
    getSingleVendor: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return To Controller
        return await getSingleVendorController(args.query, db, user, isAuth, TENANTID);
    },
    getSearchedVendors: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getSearchedVendorsController(args.query, db, user, isAuth, TENANTID);
    },
    getContactPerson: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getContactPersonController(args.query, db, user, isAuth, TENANTID);
    },
}