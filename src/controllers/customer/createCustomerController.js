const { createCustomer } = require("../../helpers/customerHelper");
const { createCustomerRequest } = require("../../requests/customerRequests");
const { singleResponse } = require("../../utils/response");

// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Create Brand Request
    const validate = await createCustomerRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE ROLE
    const data = await createCustomer(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}