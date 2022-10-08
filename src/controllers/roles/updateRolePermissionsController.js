// ALL REQUIRES
const { updateRolePermissions } = require("../../helpers/roleHelper");
const { updateRolePermissionsRequest } = require("../../requests/roleRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Validate Update Role Request
    const validate = await updateRolePermissionsRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Update ROLE
    const data = await updateRolePermissions(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}