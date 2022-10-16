// All Requires
const { getAllAttrGroups } = require("../../helpers/attributeGroupHelper");
const { singleResponse } = require("../../utils/response");


// GET ATTR Group CONTROLLER
module.exports = async (db, user, isAuth, TENANTID) => {
    const data = await getAllAttrGroups(db, user, isAuth, TENANTID);

    return singleResponse(data);
}