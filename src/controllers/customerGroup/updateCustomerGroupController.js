// ALL REQUIRES;
const { updateCustomerGroup } = require("../../helpers/customerGroupHelper");
const { updateCustomerGroupRequest } = require("../../requests/customerGroupRequests");
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

    // Validate Update Attr Group Request
    const validate = await updateCustomerGroupRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // UPDATE CUSTOMER GROUP
    const data = await updateCustomerGroup(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}