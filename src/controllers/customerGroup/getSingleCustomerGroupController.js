// ALL REQUIRES
const { getSingleCustomerGroup } = require("../../helpers/customerGroupHelper");
const { getSingleCustomerGroupRequest } = require("../../requests/customerGroupRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate GET SINGLE ATTR GROUP Request
    const validate = await getSingleCustomerGroupRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // SEND TO HELPER
    const data = await getSingleCustomerGroup(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}