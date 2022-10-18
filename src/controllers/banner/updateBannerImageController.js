// ALL REQUIRES;
const { updateBannerImage } = require("../../helpers/bannerHelper");
const { updateBannerImageRequest } = require("../../requests/bannerRequest");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Update Banner Image Request
    const validate = await updateBannerImageRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // UPDATE BANNER IMAGE
    const data = await updateBannerImage(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}