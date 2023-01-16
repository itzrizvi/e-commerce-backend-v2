// All Requires
const { getSearchedVendors } = require("../../helpers/vendorHelper");
const { singleResponse } = require("../../utils/response");

// GET ATTR CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    const data = await getSearchedVendors(req, db, user, isAuth, TENANTID);

    return singleResponse(data);
}