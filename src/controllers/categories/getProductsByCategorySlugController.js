// All Requires
const { getProductsByCategorySlug } = require("../../helpers/categoryHelper");
const { singleResponse } = require("../../utils/response");

// GET PERMISSION BY STAFF CONTROLLER
module.exports = async (req, db, TENANTID) => {

    // Sending Request to Helper
    const data = await getProductsByCategorySlug(req, db, TENANTID);
    // Final Response
    return singleResponse(data);
}