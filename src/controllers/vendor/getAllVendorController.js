// All Requires
const { getAllVendor } = require("../../helpers/vendorHelper");
const { groupResponse } = require("../../utils/response");

// GET ATTR CONTROLLER
module.exports = async (db, user, isAuth, TENANTID) => {
    const data = await getAllVendor(db, user, isAuth, TENANTID);
    return groupResponse(data);
}