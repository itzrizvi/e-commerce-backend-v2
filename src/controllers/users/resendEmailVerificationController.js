// All Requires For Email Verification
const { resendVerificationEmail } = require("../../helpers/userHelper");
const { singleResponse } = require("../../utils/response");



// Exports
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Verify Email With Helper
    const data = await resendVerificationEmail(req, db, user, isAuth, TENANTID);

    // Final Response
    return singleResponse(data);

}