// All Requires
const { getSingleCategory } = require("../../helpers/categoryHelper");
const { singleResponse } = require("../../utils/response");


// GET PERMISSION BY STAFF CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Sending Request to Helper
    const data = await getSingleCategory(req, db, user, isAuth, TENANTID);
    // Final Response
    return singleResponse(data);
}