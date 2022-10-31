const { createBanner } = require("../../helpers/bannerHelper");
const { checkPermission } = require("../../utils/permissionChecker");
const { singleResponse } = require("../../utils/response");

// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Permission Name of this API
    const permissionName = "banner";
    // Check Permission
    const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
    if (!checkPermissions.success) {
        return { message: "You don't have access to this route, please contact support to have you give this route permission!!!", status: false };
    }

    // CREATE Banner
    const data = await createBanner(req, db, user, isAuth, TENANTID);

    return singleResponse(data);
}