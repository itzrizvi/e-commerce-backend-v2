const { userSignUp } = require("../../helpers/userHelper");
const { userSignUpRequest } = require("../../requests/userRequests");
const { singleResponse } = require("../../utils/response");



//
module.exports = async (req, db) => {
    //
    const validate = await userSignUpRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    const data = await userSignUp(req, db)

    return singleResponse(data);
}