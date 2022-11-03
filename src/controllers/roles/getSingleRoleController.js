// All Requires
const { getSingleRole } = require("../../helpers/roleHelper");
const { singleResponse } = require("../../utils/response");


// GET ROLE CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // GET SINGLE ROLE
    const data = await getSingleRole(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}