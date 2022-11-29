// All Requires
const { getSingleReceivingProduct } = require("../../helpers/recevingProductHelper");
const { singleResponse } = require("../../utils/response");


// GET SINGLE TAX CLASS CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Sending Request to Helper
    const data = await getSingleReceivingProduct(req, db, user, isAuth, TENANTID);

    // Final Response
    return singleResponse(data);
}