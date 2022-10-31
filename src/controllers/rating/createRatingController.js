// ALL REQUIRES
const { createRating } = require("../../helpers/ratingHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // CREATE Rating
    const data = await createRating(req, db, user, isAuth, TENANTID);
    return singleResponse(data);
}