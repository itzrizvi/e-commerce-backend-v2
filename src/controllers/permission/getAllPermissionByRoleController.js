// All Requires
const { getAllPermissionByRole } = require("../../helpers/permissionHelper");
const { getAllPermissionByRoleRequest } = require("../../requests/permissionRequests");
const { singleResponse } = require("../../utils/response");

// GET PERMISSION BY STAFF CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate For Assign Permission Request
    const validate = await getAllPermissionByRoleRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Return If No Auth
    if (!user || !isAuth) return { message: "Not Authorized", status: false };
    if (user.role_no === '0') return { message: "Not Authorized", status: false };


    const data = await getAllPermissionByRole(req, db, user, isAuth, TENANTID);

    return singleResponse(data);
}