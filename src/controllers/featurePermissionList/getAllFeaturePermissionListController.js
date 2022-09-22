const { getAllFeaturePermission } = require("../../helpers/featurePermissionListHelper");
const { groupResponse } = require("../../utils/response");

// GET ALL Feature Permission CONTROLLER
module.exports = async (db, user, isAuth) => {
    // Return If No Auth
    if (!user || !isAuth) return { message: "Not Authorized", isAuth: false, data: [] };
    if (user.role_no === '0') return { message: "Not Authorized", isAuth: false, data: [] };

    const data = await getAllFeaturePermission(db, user, isAuth);

    return groupResponse(data);
}