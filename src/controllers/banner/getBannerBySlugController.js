// ALL REQUIRES
const { getBannerBySlug } = require("../../helpers/bannerHelper");
const { getBannerBySlugRequest } = require("../../requests/bannerRequest");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate GET BANNER BY SLUG Request
    const validate = await getBannerBySlugRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // SEND TO HELPER
    const data = await getBannerBySlug(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}