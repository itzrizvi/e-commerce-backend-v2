// All Requires
const { getSearchedProducts } = require("../../helpers/productHelper");
const { singleResponse } = require("../../utils/response");


// GET PRODUCT LIST CONTROLLER
module.exports = async (req, db, TENANTID) => {
    // Sending Request to Helper
    const data = await getSearchedProducts(req, db, TENANTID);

    // Final Response
    return singleResponse(data);
}