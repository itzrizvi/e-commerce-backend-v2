// All Requires
const { getAllCustomerGroups } = require("../../helpers/customerGroupHelper");
const { singleResponse } = require("../../utils/response");


// GET Customer Group CONTROLLER
module.exports = async (db, user, isAuth, TENANTID) => {
    const data = await getAllCustomerGroups(db, user, isAuth, TENANTID);

    return singleResponse(data);
}