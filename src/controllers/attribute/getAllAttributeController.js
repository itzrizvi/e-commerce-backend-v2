// All Requires
const { getAllAttributes } = require("../../helpers/attributeHelper");
const { singleResponse } = require("../../utils/response");


// GET ATTR CONTROLLER
module.exports = async (db, user, isAuth, TENANTID) => {
    const data = await getAllAttributes(db, user, isAuth, TENANTID);

    return singleResponse(data);
}