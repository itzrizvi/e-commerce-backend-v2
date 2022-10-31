// ALL REQUIRES
const { adminPasswordChange } = require("../../helpers/staffHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    //  ADMIN/STAFF PASSWORD CHANGE
    const data = await adminPasswordChange(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}