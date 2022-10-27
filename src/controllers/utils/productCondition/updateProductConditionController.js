const { updateProductCondition } = require("../../../helpers/utils/productConditionHelper");
const { singleResponse } = require("../../../utils/response");

module.exports = async (req, db, TENANTID) => {
    const data = await updateProductCondition(req, db, TENANTID);
    return singleResponse(data);
}