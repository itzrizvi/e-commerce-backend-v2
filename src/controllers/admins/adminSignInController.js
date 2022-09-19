const { adminSignIn } = require("../../helpers/adminHelper");
const { adminSignInRequest } = require("../../requests/adminRequests");
const { singleResponse } = require("../../utils/response");



//
module.exports = async (req, db) => {
    //
    const validate = await adminSignInRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    const data = await adminSignIn(req, db);

    return singleResponse(data);
}