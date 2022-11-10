// All Requires
const { getTopRatedProducts } = require("../../helpers/ratingHelper");
const { singleResponse } = require("../../utils/response");


// GET ROLE CONTROLLER
module.exports = async (db, TENANTID) => {

    const data = await getTopRatedProducts(db, TENANTID);
    return singleResponse(data);
}