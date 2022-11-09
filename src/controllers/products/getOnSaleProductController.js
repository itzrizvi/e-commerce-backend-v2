// All Requires
const { getOnSaleProducts } = require("../../helpers/productHelper");
const { singleResponse } = require("../../utils/response");


// GET PRODUCT LIST CONTROLLER
module.exports = async (db, TENANTID) => {
    // Sending Request to Helper
    const data = await getOnSaleProducts(db, TENANTID);

    // Final Response
    return singleResponse(data);
}