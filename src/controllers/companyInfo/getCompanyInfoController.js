// ALL REQUIRES;
const { getCompanyInfo } = require("../../helpers/companyInfo");
const { singleResponse } = require("../../utils/response");

// CONTROLLER
module.exports = async (db, TENANTID) => {

    // CREATE COUPON
    const data = await getCompanyInfo(db, TENANTID);

    return singleResponse(data);

}