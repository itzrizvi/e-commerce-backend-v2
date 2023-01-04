const { getContactPersonListByCustomerID } = require("../../helpers/customerHelper");
const { singleResponse } = require("../../utils/response");

//  CONTROLLER
module.exports = async (req, db, TENANTID) => {

    const data = await getContactPersonListByCustomerID(req, db, TENANTID);

    return singleResponse(data);
}