// All Requires
const { getPaymentMethodListPublic } = require("../../helpers/paymentHelper");
const { singleResponse } = require("../../utils/response");


// GET SINGLE PRODUCT DETAIL CONTROLLER
module.exports = async (db, TENANTID) => {

    // Sending Request to Helper
    const data = await getPaymentMethodListPublic(db, TENANTID);

    // Final Response
    return singleResponse(data);
}