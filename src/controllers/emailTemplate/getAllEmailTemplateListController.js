// All Requires
const { getAllEmailTemplateList } = require("../../helpers/emailTemplateHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (db, TENANTID) => {

    // Sending Request to Helper
    const data = await getAllEmailTemplateList(db, TENANTID);

    // Final Response
    return singleResponse(data);
}