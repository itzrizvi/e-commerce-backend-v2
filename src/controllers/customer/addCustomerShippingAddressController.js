const { addCustomerShippingAddress } = require("../../helpers/customerHelper");
const { addCustomerShippingAddressRequest } = require("../../requests/customerRequests");
const { singleResponse } = require("../../utils/response");

// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Create Brand Request
    const validate = await addCustomerShippingAddressRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE ROLE
    const data = await addCustomerShippingAddress(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}