const { getAllRatingByProduct } = require("../../helpers/ratingHelper");
const { groupResponse } = require("../../utils/response");


// GET ROLE CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    const data = await getAllRatingByProduct(req, db, user, isAuth, TENANTID);
    return groupResponse(data);
}