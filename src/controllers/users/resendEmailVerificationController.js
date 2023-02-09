// All Requires For Email Verification
const { error } = require("winston");
const logger = require("../../../logger");
const { resendVerificationEmail } = require("../../helpers/userHelper");
const { singleResponse } = require("../../utils/response");


// Exports
module.exports = async (req, db, TENANTID) => {
    try {

        // Logger
        logger.info(
            error.message,
            {
                error: error,
                apiaction: 'Resend Email Verification Controller Initating...',
                user_data: `${req.email}`,
                service: `resendVerificationEmailController.js`,
                module: `resendVerificationEmailController`
            });

        // Verify Email With Helper
        const data = await resendVerificationEmail(req, db, TENANTID);

        // Final Response
        return singleResponse(data);

    } catch (error) {
        // Logger
        logger.info(
            error.message,
            {
                error: error,
                apiaction: "Error Occurd",
                user_data: `${req.email}`,
                service: `resendVerificationEmailController.js`,
                module: `resendVerificationEmailController`
            });

        if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };
    }



}