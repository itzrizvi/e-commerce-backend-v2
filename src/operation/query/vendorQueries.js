// Vendor BASED QUERY

const { getAllVendorController, getSingleVendorController } = require("../../controllers");

module.exports = {
    // GET ALL Vendor QUERY
    getAllVendor: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return To Controller
        return await getAllVendorController(db, user, isAuth, TENANTID);
    },
    getSingleVendor: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return To Controller
        return await getSingleVendorController(args.query, db, user, isAuth, TENANTID);
    }
}