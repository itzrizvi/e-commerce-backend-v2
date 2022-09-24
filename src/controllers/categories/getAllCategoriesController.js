// All Requires
const { getAllCategories } = require("../../helpers/categoryHelper");
const { singleResponse } = require("../../utils/response");


// GET PERMISSION BY STAFF CONTROLLER
module.exports = async (db, user, isAuth, TENANT_ID) => {
    // Sending Request to Helper
    const data = await getAllCategories(db, user, isAuth, TENANT_ID);
    // Final Response
    return singleResponse(data);
}