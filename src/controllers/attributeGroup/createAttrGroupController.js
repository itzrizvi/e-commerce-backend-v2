// ALL REQUIRES;
const { createAttrGroup } = require("../../helpers/attributeGroupHelper");
const { createAttrGroupRequest } = require("../../requests/attributeRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Create Attr Group Request
    const validate = await createAttrGroupRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // CREATE ATTR GROUP
    const data = await createAttrGroup(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}