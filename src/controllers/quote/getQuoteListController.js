// All Requires
const { getQuoteList } = require("../../helpers/quoteHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (db, user, isAuth, TENANTID) => {

    // Sending Request to Helper
    const data = await getQuoteList(db, user, isAuth, TENANTID);

    // Final Response
    return singleResponse(data);
}