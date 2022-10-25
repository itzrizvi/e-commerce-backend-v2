const { updateCustomerBillingAddress } = require("../../helpers/customerHelper");
const { updateCustomerBillingAddressRequest } = require("../../requests/customerRequests");
const { singleResponse } = require("../../utils/response");

// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Create Brand Request
    const validate = await updateCustomerBillingAddressRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE ROLE
    const data = await updateCustomerBillingAddress(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}