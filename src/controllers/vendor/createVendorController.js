const { createVendor } = require("../../helpers/vendorHelper");
const { createVendorRequest } = require("../../requests/vendorRequests");
const { singleResponse } = require("../../utils/response");

// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Create Brand Request
    const validate = await createVendorRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE ROLE
    const data = await createVendor(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}