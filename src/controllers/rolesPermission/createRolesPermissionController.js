// ALL REQUIRES
const { createRolesPermission } = require("../../helpers/rolesPermissionHelper");
const { checkPermission } = require("../../utils/permissionChecker");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Permission Name of this API
    const permissionName = "permission";
    // Check Permission
    const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
    if (!checkPermissions.success) {
        return { message: "You dont have access to this route, please contact support to have you give this route permission!!!", status: false };
    }

    if (!user || !isAuth) return { message: "Not Authorized!!", status: false } // If Not Auth or User

    // CREATE ROLE
    const data = await createRolesPermission(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}