const { createBannerImage } = require("../../helpers/bannerHelper");
const { createBannerImageRequest } = require("../../requests/bannerRequest");
const { singleResponse } = require("../../utils/response");

// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Create Banner Request
    const validate = await createBannerImageRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // // CREATE Banner
    const data = await createBannerImage(req, db, user, isAuth, TENANTID);

    return singleResponse(data);
}