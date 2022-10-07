// ALL REQUIRES
const { createRolesPermission } = require("../../helpers/rolesPermissionHelper");
const { createRolesPermissionRequest } = require("../../requests/rolesPermissionRequests");
const { singleResponse } = require("../../utils/response");




// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Validate Create Role Request
    const validate = await createRolesPermissionRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    if (!user || !isAuth) return { message: "Not Authorized!!", status: false } // If Not Auth or User

    // CREATE ROLE
    const data = await createRolesPermission(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}