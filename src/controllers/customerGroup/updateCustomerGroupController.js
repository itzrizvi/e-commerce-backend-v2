// ALL REQUIRES;
const { updateCustomerGroup } = require("../../helpers/customerGroupHelper");
const { updateCustomerGroupRequest } = require("../../requests/customerGroupRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Update Attr Group Request
    const validate = await updateCustomerGroupRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // UPDATE CUSTOMER GROUP
    const data = await updateCustomerGroup(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}