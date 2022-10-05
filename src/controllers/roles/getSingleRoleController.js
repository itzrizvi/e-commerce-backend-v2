// All Requires
const { getSingleRole } = require("../../helpers/roleHelper");
const { getSingleRoleRequest } = require("../../requests/roleRequests");
const { singleResponse } = require("../../utils/response");


// GET ROLE CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Validate GET Single Role Request
    const validate = await getSingleRoleRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // GET SINGLE ROLE
    const data = await getSingleRole(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}