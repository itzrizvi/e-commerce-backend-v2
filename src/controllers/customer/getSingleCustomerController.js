const { getSingleCustomer } = require("../../helpers/customerHelper");
const { singleResponse } = require("../../utils/response");

// GET ROLE CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    const data = await getSingleCustomer(req, db, user, isAuth, TENANTID);
    return singleResponse(data);
}