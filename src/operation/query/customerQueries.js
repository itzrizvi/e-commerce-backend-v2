// Customer BASED QUERY
module.exports = {
    // GET ALL Vendor QUERY
    getAllUser: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return To Controller
        return await getAllVendorController(db, user, isAuth, TENANTID);
    }
}