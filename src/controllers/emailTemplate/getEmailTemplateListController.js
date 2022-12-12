// All Requires
const { getEmailTemplateList } = require("../../helpers/emailTemplateHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (db, user, isAuth, TENANTID) => {

    // Sending Request to Helper
    const data = await getEmailTemplateList(db, user, isAuth, TENANTID);

    // Final Response
    return singleResponse(data);
}