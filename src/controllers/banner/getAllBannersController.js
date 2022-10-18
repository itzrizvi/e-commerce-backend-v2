// All Requires
const { getAllBanners } = require("../../helpers/bannerHelper");
const { singleResponse } = require("../../utils/response");


// GET ATTR CONTROLLER
module.exports = async (db, user, isAuth, TENANTID) => {
    const data = await getAllBanners(db, user, isAuth, TENANTID);

    return singleResponse(data);
}