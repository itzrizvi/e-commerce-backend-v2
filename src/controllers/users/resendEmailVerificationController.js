// All Requires For Email Verification
const { resendVerificationEmail } = require("../../helpers/userHelper");
const { resendEmailVerifyRequest } = require("../../requests/resendEmailVerifyRequests");
const { singleResponse } = require("../../utils/response");



// Exports
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Validate Request
    const validate = await resendEmailVerifyRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Verify Email With Helper
    const data = await resendVerificationEmail(req, db, user, isAuth, TENANTID);

    // Final Response
    return singleResponse(data);

}