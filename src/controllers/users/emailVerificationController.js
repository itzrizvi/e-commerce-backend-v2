// All Requires For Email Verification
const { verifyEmail } = require("../../helpers/userHelper");
const { emailVerifyRequest } = require("../../requests/emailVerifyRequests");
const { singleResponse } = require("../../utils/response");



// Exports
module.exports = async (req, db, user, isAuth) => {

    // Validate Request
    const validate = await emailVerifyRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Verify Email With Helper
    const data = await verifyEmail(req, db, user, isAuth);

    // Final Response
    return singleResponse(data);

}