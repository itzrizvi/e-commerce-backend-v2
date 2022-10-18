// ALL REQUIRES
const { getSingleBanner } = require("../../helpers/bannerHelper");
const { getSingleBannerRequest } = require("../../requests/bannerRequest");
const { singleResponse } = require("../../utils/response");



// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate GET SINGLE BANNER Request
    const validate = await getSingleBannerRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // SEND TO HELPER
    const data = await getSingleBanner(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}