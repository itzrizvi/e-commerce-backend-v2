// ALL REQUIRES
const { deleteRole } = require("../../helpers/roleHelper");
const { deleteRoleRequest } = require("../../requests/roleRequests");
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

    // Validate Delete Role Request
    const validate = await deleteRoleRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Delete ROLE
    const data = await deleteRole(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}