const { verifyEmail } = require("../../helpers/userHelper");
const { emailVerifyRequest } = require("../../requests/emailVerifyRequests");
const { singleResponse } = require("../../utils/response");




module.exports = async (req, db, user, isAuth) => {

    //
    const validate = await emailVerifyRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    //
    const data = await verifyEmail(req, db, user, isAuth);

    //
    return singleResponse(data);

}