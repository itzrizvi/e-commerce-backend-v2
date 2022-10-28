// ALL REQUIRES;

const { updateAttribute } = require("../../helpers/attributeHelper");
const { updateAttributeRequest } = require("../../requests/attributeRequests");
const { checkPermission } = require("../../utils/permissionChecker");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Permission Name of this API
    const permissionName = "attribute";
    // Check Permission
    const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
    if (!checkPermissions.success) {
        return { message: "You dont have access to this route, please contact support to have you give this route permission!!!", status: false };
    }

    // Validate Update Attr Request
    const validate = await updateAttributeRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // UPDATE ATTR 
    const data = await updateAttribute(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}