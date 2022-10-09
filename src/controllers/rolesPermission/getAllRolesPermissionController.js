const { getAllRolesPermission } = require("../../helpers/rolesPermissionHelper");
const { groupResponse } = require("../../utils/response");

// GET ALL Feature Permission CONTROLLER
module.exports = async (db, user, isAuth, TENANTID) => {
    // Return If No Auth
    if (!user || !isAuth) return { message: "Not Authorized", status: false };
    if (user.has_role === '0') return { message: "Not Authorized", status: false };

    const data = await getAllRolesPermission(db, user, isAuth, TENANTID);

    return groupResponse(data);
}