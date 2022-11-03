// All Requires
const { adminSignUp } = require("../../helpers/adminHelper");
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

    // Return If No Auth and No Role
    if (!user || !isAuth) return { message: "Not Authorized", email: req.email, status: false };
    if (user.has_role === '0') return { message: "Not Authorized", email: req.email, status: false };

    // Send to Helper
    const data = await adminSignUp(req, db, user, isAuth, TENANTID);

    return singleResponse(data);
}