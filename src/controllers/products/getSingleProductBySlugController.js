// All Requires
const { getSingleProductBySlug } = require("../../helpers/productHelper");
const { singleResponse } = require("../../utils/response");


// GET SINGLE PRODUCT DETAIL CONTROLLER
module.exports = async (req, db, TENANTID) => {

    // Sending Request to Helper
    const data = await getSingleProductBySlug(req, db, TENANTID);

    // Final Response
    return singleResponse(data);
}