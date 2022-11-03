// ALL REQUIRES
const { getSingleBanner } = require("../../helpers/bannerHelper");
const { singleResponse } = require("../../utils/response");



// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // SEND TO HELPER
    const data = await getSingleBanner(req, db, user, isAuth, TENANTID);
    return singleResponse(data);
}