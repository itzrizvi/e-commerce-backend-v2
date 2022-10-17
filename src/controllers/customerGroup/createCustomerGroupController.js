// ALL REQUIRES;
const { createCustomerGroup } = require("../../helpers/customerGroupHelper");
const { createCustomerGroupGroupRequest } = require("../../requests/customerGroupRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Create Customer Group Request
    const validate = await createCustomerGroupGroupRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE Customer GROUP
    const data = await createCustomerGroup(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}