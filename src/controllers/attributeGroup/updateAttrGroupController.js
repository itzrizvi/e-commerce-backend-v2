// ALL REQUIRES;
const { updateAttrGroup } = require("../../helpers/attributeGroupHelper");
const { updateAttrGroupRequest } = require("../../requests/attributeRequests");
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


    // Validate Update Attr Group Request
    const validate = await updateAttrGroupRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // UPDATE ATTR GROUP
    const data = await updateAttrGroup(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}