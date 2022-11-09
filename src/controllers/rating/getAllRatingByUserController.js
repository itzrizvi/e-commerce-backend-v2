const { getAllRatingByUser } = require("../../helpers/ratingHelper");
const { groupResponse } = require("../../utils/response");


// GET ROLE CONTROLLER
module.exports = async (db, user, isAuth, TENANTID) => {
    const data = await getAllRatingByUser(db, user, isAuth, TENANTID);
    return groupResponse(data);
}