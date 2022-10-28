// ALL REQUIRES
const { updateRolePermissions } = require("../../helpers/roleHelper");
const { updateRolePermissionsRequest } = require("../../requests/roleRequests");
const { checkPermission } = require("../../utils/permissionChecker");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Permission Name of this API
    const permissionName = "role";
    // Check Permission
    const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
    if (!checkPermissions.success) {
        return { message: "You dont have access to this route, please contact support to have you give this route permission!!!", status: false };
    }

    // Validate Update Role Request
    const validate = await updateRolePermissionsRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Update ROLE
    const data = await updateRolePermissions(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}