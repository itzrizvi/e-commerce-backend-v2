// All Requires For Email Verification
const { verifyEmail } = require("../../helpers/userHelper");
const { singleResponse } = require("../../utils/response");



// Exports
module.exports = async (req, db, TENANTID) => {

    // Verify Email With Helper
    const data = await verifyEmail(req, db, TENANTID);

    // Final Response
    return singleResponse(data);

}