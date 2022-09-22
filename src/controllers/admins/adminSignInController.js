// All Requires
const { adminSignIn } = require("../../helpers/adminHelper");
const { adminSignInRequest } = require("../../requests/adminRequests");
const { singleResponse } = require("../../utils/response");



// CONTROLLER
module.exports = async (req, db) => {
    // Validate Data
    const validate = await adminSignInRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }
    // Send to Helper
    const data = await adminSignIn(req, db);

    return singleResponse(data);
}