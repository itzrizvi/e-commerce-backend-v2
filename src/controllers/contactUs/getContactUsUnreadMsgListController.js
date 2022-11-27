// All Requires
const { getContactUsUnreadMsgList } = require("../../helpers/contactUsHelper");
const { singleResponse } = require("../../utils/response");


// GET SINGLE TAX CLASS CONTROLLER
module.exports = async (db, TENANTID) => {

    // Sending Request to Helper
    const data = await getContactUsUnreadMsgList(db, TENANTID);

    // Final Response
    return singleResponse(data);
}