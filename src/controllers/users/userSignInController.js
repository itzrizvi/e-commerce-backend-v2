const { userSignIn } = require("../../helpers/userHelper");
const { singleResponse } = require("../../utils/response");


// Controller
module.exports = async (req, db, TENANTID) => {

    const data = await userSignIn(req, db, TENANTID)

    return singleResponse(data);
}