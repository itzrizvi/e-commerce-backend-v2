const { createProductCondition } = require("../../../helpers/utils/productConditionHelper");
const { singleResponse } = require("../../../utils/response");

module.exports = async (req, db, TENANTID) => {
    const data = await createProductCondition(req, db, TENANTID);
    return singleResponse(data);
}