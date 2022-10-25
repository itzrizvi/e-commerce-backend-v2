const { getAllCustomer } = require("../../helpers/customerHelper");
const { groupResponse } = require("../../utils/response");

// GET ROLE CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    const data = await getAllCustomer(req, db, user, isAuth, TENANTID);
    return groupResponse(data);
}