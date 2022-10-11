// ALL REQUIRES
const { getSingleBrand } = require("../../helpers/brandHelper");
const { getSingleBrandRequest } = require("../../requests/brandRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate GET SINGLE Brand Request
    const validate = await getSingleBrandRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE ROLE
    const data = await getSingleBrand(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}