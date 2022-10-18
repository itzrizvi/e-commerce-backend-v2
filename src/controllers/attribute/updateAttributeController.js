// ALL REQUIRES;

const { updateAttribute } = require("../../helpers/attributeHelper");
const { updateAttributeRequest } = require("../../requests/attributeRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Update Attr Request
    const validate = await updateAttributeRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // UPDATE ATTR 
    const data = await updateAttribute(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}