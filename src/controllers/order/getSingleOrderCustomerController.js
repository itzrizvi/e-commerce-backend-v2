// All Requires
const { getSingleOrderCustomer } = require("../../helpers/orderHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Sending Request to Helper
    const data = await getSingleOrderCustomer(req, db, user, isAuth, TENANTID);

    // Final Response
    return singleResponse(data);
}