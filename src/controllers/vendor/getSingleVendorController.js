// All Requires
const { getSingleVendor } = require("../../helpers/vendorHelper");
const { singleResponse } = require("../../utils/response");

// GET ATTR CONTROLLER
module.exports = async (query, db, user, isAuth, TENANTID) => {
    const data = await getSingleVendor(query, db, user, isAuth, TENANTID);
    return singleResponse(data);
}