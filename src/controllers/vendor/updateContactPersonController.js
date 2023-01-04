// ALL REQUIRES
const { updateContactPerson } = require("../../helpers/vendorHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Update Vendor
    const data = await updateContactPerson(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}