// ALL REQUIRES
const { createBrand } = require("../../helpers/brandHelper");
const { createBrandRequest } = require("../../requests/brandRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Create Brand Request
    const validate = await createBrandRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE ROLE
    const data = await createBrand(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}