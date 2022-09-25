// All Requires
const { adminSignUp } = require("../../helpers/adminHelper");
const { adminSignUpRequest } = require("../../requests/adminRequests");
const { singleResponse } = require("../../utils/response");



// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Data
    const validate = await adminSignUpRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Return If No Auth and No Role
    if (!user || !isAuth) return { message: "Not Authorized", email: req.email, status: false };
    if (user.role_no === '0') return { message: "Not Authorized", email: req.email, status: false };

    // Send to Helper
    const data = await adminSignUp(req, db, user, isAuth, TENANTID);

    return singleResponse(data);
}