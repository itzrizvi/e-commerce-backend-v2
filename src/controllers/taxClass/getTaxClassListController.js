// All Requires
const { getTaxClassList } = require("../../helpers/taxClassHelper");
const { singleResponse } = require("../../utils/response");


// GET SINGLE TAX CLASS CONTROLLER
module.exports = async (db, TENANTID) => {

    // Sending Request to Helper
    const data = await getTaxClassList(db, TENANTID);

    // Final Response
    return singleResponse(data);
}