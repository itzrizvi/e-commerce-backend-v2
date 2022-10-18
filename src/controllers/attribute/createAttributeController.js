// ALL REQUIRES;
const { createAttribute } = require("../../helpers/attributeHelper");
const { createAttributeRequest } = require("../../requests/attributeRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Create Attr Request
    const validate = await createAttributeRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE ATTR 
    const data = await createAttribute(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}