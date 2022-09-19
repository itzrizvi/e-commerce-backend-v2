// ALL REQUIRES
const { createFeaturePermission } = require("../../helpers/featurePermissionListHelper");
const { createFeaturePermissionListRequest } = require("../../requests/featurePermissionRequests");
const { singleResponse } = require("../../utils/response");




// CONTROLLER
module.exports = async (req, db, user, isAuth) => {

    // Validate Create Role Request
    const validate = await createFeaturePermissionListRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    if (!user || !isAuth) return { featureNameUUID: "Null", message: "Not Authorized!!" } // If Not Auth or User

    // CREATE ROLE
    const data = await createFeaturePermission(req, db, user, isAuth);

    return singleResponse(data);

}