// All Requires
const path = require("path");
const { error } = require("winston");
const logger = require("../../../logger");
const { forgotPassInit, forgotPassCodeMatch, forgotPassFinal } = require("../../helpers/userHelper");
const { singleResponse } = require("../../utils/response");


// FORGOT PASSWORD INITIATION (STEP 1)
const forgotPasswordInitController = async (req, db, TENANTID) => {

    try {

        // Logger
        logger.info(
            error.message,
            {
                error: error,
                apiaction: 'Forgot Password Controller Initating...',
                user_data: `${req.email}`,
                service: path.basename(__filename),
                module: `forgotPasswordInitController`
            });

        // Forgot Password Init With Helper
        const data = await forgotPassInit(req, db, TENANTID);

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
                service: path.basename(__filename),
                module: `forgotPasswordInitController`
            });

        if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };

    }


}


// FORGOT PASSWORD CODE MATCHING (STEP 2)
const forgotPasswordCodeMatchController = async (req, db, TENANTID) => {

    // Forgot Password Code Match With Helper
    const data = await forgotPassCodeMatch(req, db, TENANTID);

    // Final Response
    return singleResponse(data);


}


// FORGOT PASSWORD FINAL (STEP 3)
const forgotPasswordFinalController = async (req, db, TENANTID) => {
    // Forgot Password Final With Helper
    const data = await forgotPassFinal(req, db, TENANTID);

    // Final Response
    return singleResponse(data);


}





// Exports
module.exports = {
    forgotPasswordInitController,
    forgotPasswordCodeMatchController,
    forgotPasswordFinalController
}