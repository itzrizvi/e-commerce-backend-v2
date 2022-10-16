// ALL REQUIRES
const { getSingleAttribute } = require("../../helpers/attributeHelper");
const { getSingleAttributeRequest } = require("../../requests/attributeRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate GET SINGLE ATTR Request
    const validate = await getSingleAttributeRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // SEND TO HELPER
    const data = await getSingleAttribute(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}