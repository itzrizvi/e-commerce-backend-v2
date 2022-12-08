// All Requires
const { getSingleEmailTempHeaderFooter } = require("../../helpers/emailTemplateHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Sending Request to Helper
    const data = await getSingleEmailTempHeaderFooter(req, db, user, isAuth, TENANTID);

    // Final Response
    return singleResponse(data);
}