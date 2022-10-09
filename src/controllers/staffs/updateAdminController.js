// ALL REQUIRES
const { adminUpdate } = require("../../helpers/staffHelper");
const { updateAdminRequest } = require("../../requests/staffRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Validate Update Admin/Staff Request
    const validate = await updateAdminRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Update ADMIN/STAFF
    const data = await adminUpdate(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}