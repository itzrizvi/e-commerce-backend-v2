// All Requires
const { getReviewedQuote } = require("../../helpers/quoteHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Sending Request to Helper
    const data = await getReviewedQuote(req, db, user, isAuth, TENANTID);

    // Final Response
    return singleResponse(data);
}