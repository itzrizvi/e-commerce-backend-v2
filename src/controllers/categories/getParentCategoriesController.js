// All Requires
const { getParentCategories } = require("../../helpers/categoryHelper");
const { singleResponse } = require("../../utils/response");


// GET PARENT CATEGORIES CONTROLLER
module.exports = async (db, user, isAuth, TENANTID) => {
    // Sending Request to Helper
    const data = await getParentCategories(db, user, isAuth, TENANTID);
    // Final Response
    return singleResponse(data);
}