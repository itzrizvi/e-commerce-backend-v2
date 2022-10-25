const { getAllCustomerController, getSingleCustomerController } = require("../../controllers/customer");

// Customer BASED QUERY
module.exports = {
    // GET ALL Vendor QUERY
    getAllCustomer: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return To Controller
        return await getAllCustomerController(db, user, isAuth, TENANTID);
    },
    getSingleCustomer: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return To Controller
        return await getSingleCustomerController(args.query, db, user, isAuth, TENANTID);
    }
}