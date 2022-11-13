// All Requires
const { getWishList } = require("../../helpers/wishListHelper");
const { singleResponse } = require("../../utils/response");


//  CONTROLLER
module.exports = async (db, user, TENANTID) => {

    // Sending Request to Helper
    const data = await getWishList(db, user, TENANTID);

    // Final Response
    return singleResponse(data);
}