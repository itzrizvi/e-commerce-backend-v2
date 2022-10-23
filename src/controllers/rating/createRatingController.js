// ALL REQUIRES
const { createRating } = require("../../helpers/ratingHelper");
const { createRatingRequest } = require("../../requests/ratingRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Create Role Request
    const validate = await createRatingRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE ROLE
    const data = await createRating(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}