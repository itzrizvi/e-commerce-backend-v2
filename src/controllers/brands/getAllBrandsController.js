// All Requires
const { getAllBrands } = require("../../helpers/brandHelper");
const { singleResponse } = require("../../utils/response");


// GET ROLE CONTROLLER
module.exports = async (db, user, isAuth, TENANTID) => {
    const data = await getAllBrands(db, user, isAuth, TENANTID);

    return singleResponse(data);
}