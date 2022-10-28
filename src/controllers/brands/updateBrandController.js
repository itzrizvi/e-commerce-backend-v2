// ALL REQUIRES
const { updateBrand } = require("../../helpers/brandHelper");
const { updateBrandRequest } = require("../../requests/brandRequests");
const { checkPermission } = require("../../utils/permissionChecker");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Permission Name of this API
    const permissionName = "manufacture";
    // Check Permission
    const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
    if (!checkPermissions.success) {
        return { message: "You dont have access to this route, please contact support to have you give this route permission!!!", status: false };
    }

    // Validate Create Brand Request
    const validate = await updateBrandRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE ROLE
    const data = await updateBrand(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}