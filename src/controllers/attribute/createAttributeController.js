// ALL REQUIRES;
const { createAttribute } = require("../../helpers/attributeHelper");
const { createAttributeRequest } = require("../../requests/attributeRequests");
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

    // Validate Create Attr Request
    const validate = await createAttributeRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE ATTR 
    const data = await createAttribute(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}