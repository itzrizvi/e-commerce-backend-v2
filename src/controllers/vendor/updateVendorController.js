// ALL REQUIRES
const { updateVendor } = require("../../helpers/vendorHelper");
const { updateVendorRequest } = require("../../requests/vendorRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Validate Update Vendor Request
    const validate = await updateVendorRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Update Vendor
    const data = await updateVendor(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}