// All Requires
const { getPaymentMethodListAdmin } = require("../../helpers/paymentHelper");
const { singleResponse } = require("../../utils/response");


// GET SINGLE PRODUCT DETAIL CONTROLLER
module.exports = async (db, TENANTID) => {

    // Sending Request to Helper
    const data = await getPaymentMethodListAdmin(db, TENANTID);

    // Final Response
    return singleResponse(data);
}