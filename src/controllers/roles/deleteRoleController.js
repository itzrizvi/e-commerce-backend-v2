// ALL REQUIRES
const { deleteRole } = require("../../helpers/roleHelper");
const { deleteRoleRequest } = require("../../requests/roleRequests");
const { singleResponse } = require("../../utils/response");



// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Validate Delete Role Request
    const validate = await deleteRoleRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Delete ROLE
    const data = await deleteRole(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}