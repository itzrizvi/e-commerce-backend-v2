const { getFilterPaginatedProductsController } = require("../../controllers");


// Filter Pagination BASED QUERY
module.exports = {
    // Filter Pagination QUERIES
    getFilterPaginatedProducts: async (root, args, { db, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return To Controller
        return await getFilterPaginatedProductsController(args.query, db, TENANTID);
    },
}