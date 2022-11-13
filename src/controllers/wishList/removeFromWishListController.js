// ALL REQUIRES;
const { removeFromWishList } = require("../../helpers/wishListHelper");
const { singleResponse } = require("../../utils/response");

// CONTROLLER
module.exports = async (req, db, user, TENANTID) => {

    // Add Wish List
    const data = await removeFromWishList(req, db, user, TENANTID);

    return singleResponse(data);

}