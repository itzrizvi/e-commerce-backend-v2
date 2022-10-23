// ALL REQUIRES
const { updateVendorStatus } = require("../../helpers/vendorHelper");
const { updateVendorStatusRequest } = require("../../requests/vendorRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Validate Update Vendor Request
    const validate = await updateVendorStatusRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Update Vendor
    const data = await updateVendorStatus(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}