// ALL REQUIRES
const { orderCancelByCustomer } = require("../../helpers/orderHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // SEND TO HELPER
    const data = await orderCancelByCustomer(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}