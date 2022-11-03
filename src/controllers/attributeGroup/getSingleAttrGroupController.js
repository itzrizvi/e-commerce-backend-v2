// ALL REQUIRES
const { getSingleAttrGroup } = require("../../helpers/attributeGroupHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // SEND TO HELPER
    const data = await getSingleAttrGroup(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}