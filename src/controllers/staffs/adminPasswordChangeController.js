// ALL REQUIRES
const { adminPasswordChange } = require("../../helpers/staffHelper");
const { adminPasswordChangeRequest } = require("../../requests/staffRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Validate Admin/Staff Password Change Request
    const validate = await adminPasswordChangeRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    //  ADMIN/STAFF PASSWORD CHANGE
    const data = await adminPasswordChange(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}