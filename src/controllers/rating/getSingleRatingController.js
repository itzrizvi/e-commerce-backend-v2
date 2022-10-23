const { getSingleRating } = require("../../helpers/ratingHelper");
const { singleResponse } = require("../../utils/response");


// GET ROLE CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    const data = await getSingleRating(req, db, user, isAuth, TENANTID);
    return singleResponse(data);
}