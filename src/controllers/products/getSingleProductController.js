// All Requires
const { getSingleProduct } = require("../../helpers/productHelper");
const { singleResponse } = require("../../utils/response");


// GET SINGLE PRODUCT DETAIL CONTROLLER
module.exports = async (req, db, TENANTID) => {

    // Sending Request to Helper
    const data = await getSingleProduct(req, db, TENANTID);

    // Final Response
    return singleResponse(data);
}