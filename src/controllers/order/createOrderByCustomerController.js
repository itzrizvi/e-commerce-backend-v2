// ALL REQUIRES;
const { createOrderByCustomer } = require("../../helpers/orderHelper");
const { checkPermission } = require("../../utils/permissionChecker");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // CREATE Customer GROUP
    const data = await createOrderByCustomer(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}