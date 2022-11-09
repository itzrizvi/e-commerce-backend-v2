// ALL REQUIRES
const { getSingleBrand } = require("../../helpers/brandHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {

    // CREATE ROLE
    const data = await getSingleBrand(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}