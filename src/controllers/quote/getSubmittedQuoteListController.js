// All Requires
const { getSubmittedQuoteList } = require("../../helpers/quoteHelper");
const { checkPermission } = require("../../utils/permissionChecker");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // Permission Name of this API
    const permissionName = "quote";
    // Check Permission
    const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
    if (!checkPermissions.success) {
        return { message: "You dont have access to this route, please contact support to have you give this route permission!!!", status: false };
    }


    // Sending Request to Helper
    const data = await getSubmittedQuoteList(req, db, user, isAuth, TENANTID);

    // Final Response
    return singleResponse(data);
}