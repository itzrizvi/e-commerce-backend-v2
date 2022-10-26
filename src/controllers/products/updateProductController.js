// All Requires
const { updateProduct } = require("../../helpers/productHelper");
const { updateProductRequest } = require("../../requests/productRequests");
const { singleResponse } = require("../../utils/response");

// Update Product Controller
module.exports = async (req, db, user, TENANTID) => {

    // Validate Create Role Request
    const validate = await updateProductRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Return If No Auth
    if (user.has_role === '0') return { message: "Not Authorized", status: false };

    // Helper
    const data = await updateProduct(req, db, user, TENANTID);

    // Return Data
    return singleResponse(data);

}