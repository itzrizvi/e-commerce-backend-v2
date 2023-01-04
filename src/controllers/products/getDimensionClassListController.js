// All Requires
const { getDimensionClassList } = require("../../helpers/productHelper");
const { singleResponse } = require("../../utils/response");


// GET  CONTROLLER
module.exports = async (db, TENANTID) => {
    // Sending Request to Helper
    const data = await getDimensionClassList(db, TENANTID);

    // Final Response
    return singleResponse(data);
}