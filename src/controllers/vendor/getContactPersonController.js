// All Requires
const { getContactPerson } = require("../../helpers/vendorHelper");
const { singleResponse } = require("../../utils/response");

// GET CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    const data = await getContactPerson(req, db, user, isAuth, TENANTID);

    return singleResponse(data);
}