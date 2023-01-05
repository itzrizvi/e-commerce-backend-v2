// All Requires
const { getProductList } = require("../../helpers/productHelper");
const { singleResponse } = require("../../utils/response");


// GET PRODUCT LIST CONTROLLER
module.exports = async (req, db, user, TENANTID) => {
    // Sending Request to Helper
    const data = await getProductList(req, db, TENANTID);

    // Final Response
    return singleResponse(data);
}