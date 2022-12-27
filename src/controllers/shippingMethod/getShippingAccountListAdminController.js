// ALL REQUIRES;
const { getShippingAccountListAdmin } = require("../../helpers/shippingMethodHelper");
const { checkPermission } = require("../../utils/permissionChecker");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (db, user, isAuth, TENANTID) => {
    // Permission Name of this API
    const permissionName = "shipping-method";
    // Check Permission
    const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
    if (!checkPermissions.success) {
        return { message: "You dont have access to this route, please contact support to have you give this route permission!!!", status: false };
    }

    // SEND TO HELPER
    const data = await getShippingAccountListAdmin(db, TENANTID);

    return singleResponse(data);

}