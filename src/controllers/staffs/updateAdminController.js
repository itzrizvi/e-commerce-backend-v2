// ALL REQUIRES
const { adminUpdate } = require("../../helpers/staffHelper");
const { updateAdminRequest } = require("../../requests/staffRequests");
const { checkPermission } = require("../../utils/permissionChecker");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Permission Name of this API
    const permissionName = "user";
    // Check Permission
    const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
    if (!checkPermissions.success) {
        return { message: "You dont have access to this route, please contact support to have you give this route permission!!!", status: false };
    }


    // Validate Update Admin/Staff Request
    const validate = await updateAdminRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Update ADMIN/STAFF
    const data = await adminUpdate(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}