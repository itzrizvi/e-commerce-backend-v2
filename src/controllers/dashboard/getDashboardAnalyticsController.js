// All Requires
const { getDashboardAnalytics } = require("../../helpers/dashboardHelper");
const { singleResponse } = require("../../utils/response");


// GET SINGLE TAX CLASS CONTROLLER
module.exports = async (db, user, isAuth, TENANTID) => {

    // Sending Request to Helper
    const data = await getDashboardAnalytics(db, user, isAuth, TENANTID);

    // Final Response
    return singleResponse(data);
}