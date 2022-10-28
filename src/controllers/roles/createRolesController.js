// ALL REQUIRES
const { createRoleWithPermission } = require("../../helpers/roleHelper");
const { createRoleRequest } = require("../../requests/roleRequests");
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

    // Validate Create Role Request
    const validate = await createRoleRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE ROLE
    const data = await createRoleWithPermission(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}