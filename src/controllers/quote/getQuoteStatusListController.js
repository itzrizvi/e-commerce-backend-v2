// All Requires
const { getQuoteStatusList } = require("../../helpers/quoteHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (db, TENANTID) => {

    // Sending Request to Helper
    const data = await getQuoteStatusList(db, TENANTID);

    // Final Response
    return singleResponse(data);
}