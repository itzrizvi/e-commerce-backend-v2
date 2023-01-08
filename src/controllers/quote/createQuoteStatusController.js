// ALL REQUIRES;
const { createQuoteStatus } = require("../../helpers/quoteHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // SEND TO HELPER
    const data = await createQuoteStatus(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}