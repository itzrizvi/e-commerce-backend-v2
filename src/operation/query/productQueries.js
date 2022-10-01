// All Requires
const { getSingleProductController } = require("../../controllers")


module.exports = {
    // GET Single Product Details
    getSingleProduct: async (root, args, { db, TENANTID }, info) => {
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return to Controller
        return await getSingleProductController(args.query, db, TENANTID);
    }
}