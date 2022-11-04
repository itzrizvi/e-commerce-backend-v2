// All Requires
const { getSingleTaxClassAdmin } = require("../../helpers/taxClassHelper");
const { singleResponse } = require("../../utils/response");


// GET SINGLE TAX CLASS CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Sending Request to Helper
    const data = await getSingleTaxClassAdmin(req, db, user, isAuth, TENANTID);

    // Final Response
    return singleResponse(data);
}