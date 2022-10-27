// All Requires
const { getProductList } = require("../../helpers/productHelper");
const { singleResponse } = require("../../utils/response");


// GET PRODUCT LIST CONTROLLER
module.exports = async (db, user, TENANTID) => {
    // Sending Request to Helper
    const data = await getProductList(db, TENANTID);

    // Final Response
    return singleResponse(data);
}