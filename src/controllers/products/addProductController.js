// All Requires
const { addProduct } = require("../../helpers/productHelper");
const { addProductRequest } = require("../../requests/productRequests");
const { singleResponse } = require("../../utils/response");

// Add Product Controller
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Validate Create Role Request
    const validate = await addProductRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Return If No Auth
    if (!user || !isAuth) return { message: "Not Authorized", status: false };
    if (user.role_no === '0') return { message: "Not Authorized", status: false };

    // Helper
    const data = await addProduct(req, db, user, isAuth, TENANTID);

    // Return Data
    return singleResponse(data);

}