// ALL REQUIRES
const { getSingleCustomerGroup } = require("../../helpers/customerGroupHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // SEND TO HELPER
    const data = await getSingleCustomerGroup(req, db, user, isAuth, TENANTID);
    return singleResponse(data);
}