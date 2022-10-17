const { createBanner } = require("../../helpers/bannerHelper");
const { createBannerRequest } = require("../../requests/bannerRequest");
const { singleResponse } = require("../../utils/response");

// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Validate Create Banner Request
    const validate = await createBannerRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE Banner
    const data = await createBanner(req, db, user, isAuth, TENANTID);

    return singleResponse(data);
}