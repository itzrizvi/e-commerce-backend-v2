// All Requires
const { getSingleContactUsMsg } = require("../../helpers/contactUsHelper");
const { singleResponse } = require("../../utils/response");


// GET SINGLE CONTACT US MESSAGE CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Sending Request to Helper
    const data = await getSingleContactUsMsg(req, db, user, isAuth, TENANTID);

    // Final Response
    return singleResponse(data);
}