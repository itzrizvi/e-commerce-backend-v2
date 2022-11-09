// All Requires
const { adminSignIn } = require("../../helpers/adminHelper");
const { singleResponse } = require("../../utils/response");



// CONTROLLER
module.exports = async (req, db, TENANTID) => {

    // Send to Helper
    const data = await adminSignIn(req, db, TENANTID);

    return singleResponse(data);
}