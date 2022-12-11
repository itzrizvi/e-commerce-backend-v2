// ALL REQUIRES;
const { createReceiving } = require("../../helpers/purchaseOrderHelper");
const { checkPermission } = require("../../utils/permissionChecker");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Permission Name of this API
    const permissionName = "receiving-product";
    // Check Permission
    const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
    if (!checkPermissions.success) {
        return { message: "You dont have access to this route, please contact support to have you give this route permission!!!", status: false };
    }

    // HELPER
    const data = await createReceiving(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}