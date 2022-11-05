// All Requires
const { getProductsByIDs } = require("../../helpers/productHelper");
const { singleResponse } = require("../../utils/response");


// GET PRODUCT LIST CONTROLLER
module.exports = async (req, db, TENANTID) => {
    // Sending Request to Helper
    const data = await getProductsByIDs(req, db, TENANTID);

    // Final Response
    return singleResponse(data);
}