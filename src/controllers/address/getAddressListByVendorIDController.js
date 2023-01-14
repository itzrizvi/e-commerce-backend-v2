// All Requires
const { getAddressListByVendorID } = require("../../helpers/addressHelper");
const { singleResponse } = require("../../utils/response");


// GET ATTR CONTROLLER
module.exports = async (req, db, user, TENANTID) => {
    const data = await getAddressListByVendorID(req, db, user, TENANTID);

    return singleResponse(data);
}