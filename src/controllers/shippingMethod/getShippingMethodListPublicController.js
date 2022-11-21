// All Requires
const { getShippingMethodListPublic } = require("../../helpers/shippingMethodHelper");
const { singleResponse } = require("../../utils/response");


// GET SINGLE PRODUCT DETAIL CONTROLLER
module.exports = async (db, TENANTID) => {

    // Sending Request to Helper
    const data = await getShippingMethodListPublic(db, TENANTID);

    // Final Response
    return singleResponse(data);
}