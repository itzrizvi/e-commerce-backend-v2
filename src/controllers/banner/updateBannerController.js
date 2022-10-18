// ALL REQUIRES;

const { updateBanner } = require("../../helpers/bannerHelper");
const { updateBannerRequest } = require("../../requests/bannerRequest");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Update Banner Request
    const validate = await updateBannerRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // UPDATE BANNER 
    const data = await updateBanner(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}