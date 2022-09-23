// All Requires
const { getAllPermissionByStaff } = require("../../helpers/permissionHelper");
const { getAllPermissionByStaffRequest } = require("../../requests/permissionRequests");
const { singleResponse } = require("../../utils/response");

// GET PERMISSION BY STAFF CONTROLLER
module.exports = async (req, db, user, isAuth) => {
    // Validate For Assign Permission Request
    const validate = await getAllPermissionByStaffRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Return If No Auth
    if (!user || !isAuth) return { message: "Not Authorized", isAuth: false };
    if (user.role_no === '0') return { message: "Not Authorized", isAuth: false };


    const data = await getAllPermissionByStaff(req, db, user, isAuth);

    return singleResponse(data);
}