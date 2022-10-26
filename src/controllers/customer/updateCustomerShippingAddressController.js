const { updateCustomerShippingAddress } = require("../../helpers/customerHelper");
const { updateCustomerShippingAddressRequest } = require("../../requests/customerRequests");
const { singleResponse } = require("../../utils/response");

// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Create Brand Request
    const validate = await updateCustomerShippingAddressRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE ROLE
    const data = await updateCustomerShippingAddress(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}