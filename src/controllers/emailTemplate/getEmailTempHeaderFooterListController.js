// All Requires
const { getEmailTempHeaderFooterList } = require("../../helpers/emailTemplateHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (db, TENANTID) => {

    // Sending Request to Helper
    const data = await getEmailTempHeaderFooterList(db, TENANTID);

    // Final Response
    return singleResponse(data);
}