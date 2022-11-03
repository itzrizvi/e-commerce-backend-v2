const { getAllProductCondition } = require("../../../helpers/utils/productConditionHelper");
const { singleResponse } = require("../../../utils/response");

// GET Customer Group CONTROLLER
module.exports = async (db, TENANTID) => {

    const data = await getAllProductCondition(db, TENANTID);

    return singleResponse(data);
}