// ALL REQUIRES
const { getSingleAdmin } = require("../../helpers/staffHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // GET SINGLE ADMIN/STAFF
    const data = await getSingleAdmin(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}