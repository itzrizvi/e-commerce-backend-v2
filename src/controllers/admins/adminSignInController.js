// All Requires
const path = require("path");
const { error } = require("winston");
const logger = require("../../../logger");
const { adminSignIn } = require("../../helpers/adminHelper");
const { singleResponse } = require("../../utils/response");



// CONTROLLER
module.exports = async (req, db, TENANTID) => {

    try {
        // Logger
        logger.info(
            error.message,
            {
                error: error,
                apiaction: 'Admin Sign In Controller Initating...',
                user_data: `${req.email}`,
                service: path.basename(__filename),
                module: `adminSignInController`
            });

        // Send to Helper
        const data = await adminSignIn(req, db, TENANTID);

        return singleResponse(data);

    } catch (error) {

        // Logger
        logger.info(
            error.message,
            {
                error: error,
                apiaction: "Error Occurd",
                user_data: `${req.email}`,
                service: path.basename(__filename),
                module: `adminSignInController`
            });

        if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };
    }


}