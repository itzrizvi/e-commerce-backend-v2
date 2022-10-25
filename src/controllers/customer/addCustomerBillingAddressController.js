const { addCustomerBillingAddress } = require("../../helpers/customerHelper");
const { addCustomerBillingAddressRequest } = require("../../requests/customerRequests");
const { singleResponse } = require("../../utils/response");

// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Create Brand Request
    const validate = await addCustomerBillingAddressRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE ROLE
    const data = await addCustomerBillingAddress(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}