const { createProductAvailabilityStatus } = require("../../../helpers/utils/productAvailabilityStatusHelper");
const { singleResponse } = require("../../../utils/response");
const { checkPermission } = require("../../../utils/permissionChecker");

module.exports = async (req, db, TENANTID) => {
    // Check Permission
    const checkPermissions = await checkPermission(db, user, TENANTID, "product-availability-status");
    if (!checkPermissions.success) {
        return { message: "You don't have access to this route, please contact support to have you give this route permission!!!", status: false };
    }
    const data = await createProductAvailabilityStatus(req, db, TENANTID);
    return singleResponse(data);
}