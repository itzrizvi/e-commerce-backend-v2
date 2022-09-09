const { userSignIn } = require("../../helpers/userHelper");
const { userSignInRequest } = require("../../requests/userRequests");
const { singleResponse } = require("../../utils/response");



//
module.exports = async (req, db) => {
    //
    const validate = await userSignInRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    const data = await userSignIn(req, db)

    return singleResponse(data);
}