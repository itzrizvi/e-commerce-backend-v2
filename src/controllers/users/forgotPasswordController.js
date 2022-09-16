const { forgotPassInit } = require("../../helpers/userHelper");
const { forgotPassInitRequest } = require("../../requests/forgotPassRequests");
const { singleResponse } = require("../../utils/response");



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





// Exports
module.exports = {
    forgotPasswordInitController
}