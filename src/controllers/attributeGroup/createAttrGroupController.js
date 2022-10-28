// ALL REQUIRES;
const { createAttrGroup } = require("../../helpers/attributeGroupHelper");
const { createAttrGroupRequest } = require("../../requests/attributeRequests");
const { checkPermission } = require("../../utils/permissionChecker");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Permission Name of this API
    const permissionName = "attribute-group";
    // Check Permission
    const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
    if (!checkPermissions.success) {
        return { message: "You dont have access to this route, please contact support to have you give this route permission!!!", status: false };
    }

    // Validate Create Attr Group Request
    const validate = await createAttrGroupRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE ATTR GROUP
    const data = await createAttrGroup(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}