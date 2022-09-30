// All Requires
const { getSingleProduct } = require("../../helpers/productHelper");
const { singleResponse } = require("../../utils/response");


// GET SINGLE PRODUCT DETAIL CONTROLLER
module.exports = async (db, TENANTID) => {
    // Sending Request to Helper
    const data = await getSingleProduct(db, TENANTID);

    // Final Response
    return singleResponse(data);
}