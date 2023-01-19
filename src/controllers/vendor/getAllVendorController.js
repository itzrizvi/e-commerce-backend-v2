// All Requires
const { getAllVendor } = require("../../helpers/vendorHelper");
const { groupResponse } = require("../../utils/response");

// GET ATTR CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    const data = await getAllVendor(req, db, user, isAuth, TENANTID);
    return groupResponse(data);
}