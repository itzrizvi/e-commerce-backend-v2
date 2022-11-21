// All Requires
const { getSingleShippingMethod } = require("../../helpers/shippingMethodHelper");
const { singleResponse } = require("../../utils/response");


// GET SINGLE PRODUCT DETAIL CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Sending Request to Helper
    const data = await getSingleShippingMethod(req, db, user, isAuth, TENANTID);

    // Final Response
    return singleResponse(data);
}