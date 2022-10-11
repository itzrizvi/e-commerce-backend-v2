// ALL REQUIRES
const { updateBrand } = require("../../helpers/brandHelper");
const { updateBrandRequest } = require("../../requests/brandRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Create Brand Request
    const validate = await updateBrandRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE ROLE
    const data = await updateBrand(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}