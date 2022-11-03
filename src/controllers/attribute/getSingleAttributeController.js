// ALL REQUIRES
const { getSingleAttribute } = require("../../helpers/attributeHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // SEND TO HELPER
    const data = await getSingleAttribute(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}