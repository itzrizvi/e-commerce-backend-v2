// All Requires
const { getSingleTaxClassPublic } = require("../../helpers/taxClassHelper");
const { singleResponse } = require("../../utils/response");


// GET SINGLE TAX CLASS CONTROLLER
module.exports = async (req, db, TENANTID) => {

    // Sending Request to Helper
    const data = await getSingleTaxClassPublic(req, db, TENANTID);

    // Final Response
    return singleResponse(data);
}