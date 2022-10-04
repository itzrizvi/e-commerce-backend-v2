// ALL REQUIRES
const { updateRole } = require("../../helpers/roleHelper");
const { updateRoleRequest } = require("../../requests/roleRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Validate Update Role Request
    const validate = await updateRoleRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Update ROLE
    const data = await updateRole(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}