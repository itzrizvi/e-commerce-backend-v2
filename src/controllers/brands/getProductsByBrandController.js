// ALL REQUIRES
const { getProductsByBrand } = require("../../helpers/brandHelper");
const { getProductsByBrandRequest } = require("../../requests/brandRequests");
const { singleResponse } = require("../../utils/response");

// CONTROLLER
module.exports = async (req, db, TENANTID) => {
    // Validate GET SINGLE Brand Request
    const validate = await getProductsByBrandRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE ROLE
    const data = await getProductsByBrand(req, db, TENANTID);

    return singleResponse(data);

}