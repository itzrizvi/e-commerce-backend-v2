// All Requires
const { getFeaturedCategories } = require("../../helpers/categoryHelper");
const { singleResponse } = require("../../utils/response");



// GET PERMISSION BY STAFF CONTROLLER
module.exports = async (db, TENANTID) => {
    // Sending Request to Helper
    const data = await getFeaturedCategories(db, TENANTID);
    // Final Response
    return singleResponse(data);
}