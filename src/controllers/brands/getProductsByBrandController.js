// ALL REQUIRES
const { getProductsByBrand } = require("../../helpers/brandHelper");
const { singleResponse } = require("../../utils/response");

// CONTROLLER
module.exports = async (req, db, TENANTID) => {

    // CREATE ROLE
    const data = await getProductsByBrand(req, db, TENANTID);

    return singleResponse(data);

}