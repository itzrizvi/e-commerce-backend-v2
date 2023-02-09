// All Requires For Email Verification
const { error } = require("winston");
const logger = require("../../../logger");
const { verifyEmail } = require("../../helpers/userHelper");
const { singleResponse } = require("../../utils/response");


// Exports
module.exports = async (req, db, TENANTID) => {
    try {
        // Logger
        logger.info(
            error.message,
            {
                error: error,
                apiaction: 'User Email Verification Controller Initating...',
                user_data: `${req.email}`,
                service: `emailVerifyController.js`,
                module: `emailVerifyController`
            });

        // Verify Email With Helper
        const data = await verifyEmail(req, db, TENANTID);
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
                service: `emailVerifyController.js`,
                module: `emailVerifyController`
            });

        if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };

    }



}