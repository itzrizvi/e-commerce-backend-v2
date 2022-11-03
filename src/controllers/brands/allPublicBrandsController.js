// All Requires
const { allPublicBrands } = require("../../helpers/brandHelper");
const { singleResponse } = require("../../utils/response");


// GET ROLE CONTROLLER
module.exports = async (db, TENANTID) => {
    const data = await allPublicBrands(db, TENANTID);

    return singleResponse(data);
}