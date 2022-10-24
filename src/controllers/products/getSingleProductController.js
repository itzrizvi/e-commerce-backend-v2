// All Requires
const { getSingleProduct } = require("../../helpers/productHelper");
const { getSingleProductRequest } = require("../../requests/productRequests");
const { singleResponse } = require("../../utils/response");


// GET SINGLE PRODUCT DETAIL CONTROLLER
module.exports = async (req, db, TENANTID) => {

    // Validate Add Product Request
    const validate = await getSingleProductRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }
    // Sending Request to Helper
    const data = await getSingleProduct(req, db, TENANTID);

    // Final Response
    return singleResponse(data);
}