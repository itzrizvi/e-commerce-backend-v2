// ALL REQUIRES;
const { quoteItemDelete } = require("../../helpers/quoteHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // SEND TO HELPER
    const data = await quoteItemDelete(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}