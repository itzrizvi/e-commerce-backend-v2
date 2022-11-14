// All Requires
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");


// Filter Pagination HELPER
module.exports = {
    // GET Product By Filter Pagination Helper
    getFilterPaginatedProducts: async (req, db, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { sortingType,
                perPage,
                pageNumber,
                minPrice,
                maxPrice,
                brand_id,
                category_id,
                brand_slug,
                category_slug } = req;

            console.log(req)





        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },

}