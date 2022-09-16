// All Requires
const { forgotPassInit, forgotPassCodeMatch, forgotPassFinal } = require("../../helpers/userHelper");
const { forgotPassInitRequest, forgotPassCodeMatchRequest, forgotPassFinalRequest } = require("../../requests/forgotPassRequests");
const { singleResponse } = require("../../utils/response");


// FORGOT PASSWORD INITIATION (STEP 1)
const forgotPasswordInitController = async (req, db) => {

    // Validate Request
    const validate = await forgotPassInitRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Forgot Password Init With Helper
    const data = await forgotPassInit(req, db);

    // Final Response
    return singleResponse(data);
}


// FORGOT PASSWORD CODE MATCHING (STEP 2)
const forgotPasswordCodeMatchController = async (req, db) => {

    // Validate Request
    const validate = await forgotPassCodeMatchRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Forgot Password Code Match With Helper
    const data = await forgotPassCodeMatch(req, db);

    // Final Response
    return singleResponse(data);


}


// FORGOT PASSWORD FINAL (STEP 3)
const forgotPasswordFinalController = async (req, db) => {

    // Validate Request
    const validate = await forgotPassFinalRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // Forgot Password Final With Helper
    const data = await forgotPassFinal(req, db);

    // Final Response
    return singleResponse(data);


}





// Exports
module.exports = {
    forgotPasswordInitController,
    forgotPasswordCodeMatchController,
    forgotPasswordFinalController
}