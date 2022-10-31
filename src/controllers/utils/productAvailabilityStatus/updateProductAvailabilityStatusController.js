const { updateProductAvailabilityStatus } = require("../../../helpers/utils/productAvailabilityStatusHelper");
const { checkPermission } = require("../../../utils/permissionChecker");
const { singleResponse } = require("../../../utils/response");

module.exports = async (req, db, TENANTID) => {
    // Check Permission
    // const checkPermissions = await checkPermission(db, user, TENANTID, "product-availability-status");
    // if (!checkPermissions.success) {
    //     return { message: "You don't have access to this route, please contact support to have you give this route permission!!!", status: false };
    // }
    const data = await updateProductAvailabilityStatus(req, db, TENANTID);
    return singleResponse(data);
}