// All Requires
const { getLatestProducts } = require("../../helpers/productHelper");
const { singleResponse } = require("../../utils/response");


// GET PRODUCT LIST CONTROLLER
module.exports = async (db, TENANTID) => {
    // Sending Request to Helper
    const data = await getLatestProducts(db, TENANTID);

    // Final Response
    return singleResponse(data);
}