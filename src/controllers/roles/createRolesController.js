// ALL REQUIRES
const { createRoleWithPermission } = require("../../helpers/roleHelper");
const { createRoleRequest } = require("../../requests/roleRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Create Role Request
    const validate = await createRoleRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE ROLE
    const data = await createRoleWithPermission(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}