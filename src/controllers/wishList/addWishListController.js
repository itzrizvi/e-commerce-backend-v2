// ALL REQUIRES;
const { addWishList } = require("../../helpers/wishListHelper");
const { singleResponse } = require("../../utils/response");

// CONTROLLER
module.exports = async (req, db, user, TENANTID) => {

    // Add Wish List
    const data = await addWishList(req, db, user, TENANTID);

    return singleResponse(data);

}