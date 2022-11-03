// All Requires
const { setPassword } = require("../../helpers/adminHelper");
const { singleResponse } = require("../../utils/response");



// CONTROLLER
module.exports = async (req, db, TENANTID) => {

    // Send to Helper
    const data = await setPassword(req, db, TENANTID);

    return singleResponse(data);
}