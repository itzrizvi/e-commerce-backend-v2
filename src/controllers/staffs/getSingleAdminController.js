// ALL REQUIRES
const { getSingleAdmin } = require("../../helpers/staffHelper");
const { getSingleAdminRequest } = require("../../requests/staffRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Validate GET SINGLE Admin/Staff Request
    const validate = await getSingleAdminRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // GET SINGLE ADMIN/STAFF
    const data = await getSingleAdmin(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}