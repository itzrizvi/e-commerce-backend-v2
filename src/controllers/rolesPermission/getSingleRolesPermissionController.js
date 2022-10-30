// All Requires
const { getSingleRolesPermission } = require("../../helpers/rolesPermissionHelper");
const { singleResponse } = require("../../utils/response");


// GET Single Roles Permission CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // GET SINGLE ROLE
    const data = await getSingleRolesPermission(req, db, user, isAuth, TENANTID);

    return singleResponse(data);
}