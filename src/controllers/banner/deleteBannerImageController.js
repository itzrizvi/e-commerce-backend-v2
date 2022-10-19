// ALL REQUIRES
const { deleteBannerImage } = require("../../helpers/bannerHelper");
const { deleteBannerImageRequest } = require("../../requests/bannerRequest");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate DELETE BANNER IMAGE Request
    const validate = await deleteBannerImageRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // SEND TO HELPER
    const data = await deleteBannerImage(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}