// All Requires
const { getSingleRolesPermission } = require("../../helpers/rolesPermissionHelper");
const { getSingleRolesPermissionRequest } = require("../../requests/rolesPermissionRequests");
const { singleResponse } = require("../../utils/response");


// GET Single Roles Permission CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Validate GET Single Role Request
    const validate = await getSingleRolesPermissionRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // GET SINGLE ROLE
    const data = await getSingleRolesPermission(req, db, user, isAuth, TENANTID);

    return singleResponse(data);
}