const { getSingleProductCondition } = require("../../../helpers/utils/productConditionHelper");
const { checkPermission } = require("../../../utils/permissionChecker");
const { singleResponse } = require("../../../utils/response");

// CONTROLLER
module.exports = async (req, db, TENANTID) => {
    // Check Permission
    const checkPermissions = await checkPermission(db, user, TENANTID, "product-condition");
    if (!checkPermissions.success) {
        return { message: "You don't have access to this route, please contact support to have you give this route permission!!!", status: false };
    }
    // SEND TO HELPER
    const data = await getSingleProductCondition(req, db, TENANTID);
    return singleResponse(data);
}