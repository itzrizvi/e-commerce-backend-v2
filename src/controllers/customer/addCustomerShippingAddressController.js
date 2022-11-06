const { addCustomerShippingAddress } = require("../../helpers/customerHelper");
const { checkPermission } = require("../../utils/permissionChecker");
const { singleResponse } = require("../../utils/response");

// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // // Permission Name of this API
    // const permissionName = "customer";
    // // Check Permission
    // const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
    // if (!checkPermissions.success) {
    //     return { message: "You dont have access to this route, please contact support to have you give this route permission!!!", status: false };
    // }

    // CREATE ROLE
    const data = await addCustomerShippingAddress(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}