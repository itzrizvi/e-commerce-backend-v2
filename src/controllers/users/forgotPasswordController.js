// All Requires
const { forgotPassInit, forgotPassCodeMatch, forgotPassFinal } = require("../../helpers/userHelper");
const { singleResponse } = require("../../utils/response");


// FORGOT PASSWORD INITIATION (STEP 1)
const forgotPasswordInitController = async (req, db, TENANTID) => {
    // Forgot Password Init With Helper
    const data = await forgotPassInit(req, db, TENANTID);

    // Final Response
    return singleResponse(data);
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