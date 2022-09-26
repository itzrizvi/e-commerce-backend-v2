// ALL REQUIRES
const { assignPermission } = require("../../helpers/permissionHelper");
const { assignPermissionRequest } = require("../../requests/permissionRequests");
const { singleResponse } = require("../../utils/response");



// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Validate For Assign Permission Request
    const validate = await assignPermissionRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    if (!user || !isAuth) return { message: "Not Authorized", status: false } // If Not Auth or User
    if (user.role_no === '0') return { message: "Not Authorized", status: false } // If Not Auth or User

    // Assign Permission By Helper
    const data = await assignPermission(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}