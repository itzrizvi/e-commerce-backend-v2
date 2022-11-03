// ALL REQUIRES
const { getBannerBySlug } = require("../../helpers/bannerHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // SEND TO HELPER
    const data = await getBannerBySlug(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}