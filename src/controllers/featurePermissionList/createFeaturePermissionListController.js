// ALL REQUIRES
const { createFeaturePermission } = require("../../helpers/featurePermissionListHelper");
const { createFeaturePermissionListRequest } = require("../../requests/featurePermissionRequests");
const { singleResponse } = require("../../utils/response");




// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Validate Create Role Request
    const validate = await createFeaturePermissionListRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    if (!user || !isAuth) return { message: "Not Authorized!!", status: false } // If Not Auth or User

    // CREATE ROLE
    const data = await createFeaturePermission(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}