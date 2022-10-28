// ALL REQUIRES;
const { createCustomerGroup } = require("../../helpers/customerGroupHelper");
const { createCustomerGroupGroupRequest } = require("../../requests/customerGroupRequests");
const { checkPermission } = require("../../utils/permissionChecker");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Permission Name of this API
    const permissionName = "customer-group";
    // Check Permission
    const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
    if (!checkPermissions.success) {
        return { message: "You dont have access to this route, please contact support to have you give this route permission!!!", status: false };
    }

    // Validate Create Customer Group Request
    const validate = await createCustomerGroupGroupRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE Customer GROUP
    const data = await createCustomerGroup(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}