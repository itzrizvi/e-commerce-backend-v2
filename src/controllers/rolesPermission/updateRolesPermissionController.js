// ALL REQUIRES
const { updateRolesPermission } = require("../../helpers/rolesPermissionHelper");
const { updateRolesPermissionRequest } = require("../../requests/rolesPermissionRequests");
const { singleResponse } = require("../../utils/response");




// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Validate Update Roles Permission Request
    const validate = await updateRolesPermissionRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE ROLE
    const data = await updateRolesPermission(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}