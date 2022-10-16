// ALL REQUIRES;
const { updateAttrGroup } = require("../../helpers/attributeGroupHelper");
const { updateAttrGroupRequest } = require("../../requests/attributeRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate Update Attr Group Request
    const validate = await updateAttrGroupRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // UPDATE ATTR GROUP
    const data = await updateAttrGroup(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}