// ALL REQUIRES
const { getSingleAttrGroup } = require("../../helpers/attributeGroupHelper");
const { getSingleAttrGroupRequest } = require("../../requests/attributeRequests");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
    // Validate GET SINGLE ATTR GROUP Request
    const validate = await getSingleAttrGroupRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }

    // SEND TO HELPER
    const data = await getSingleAttrGroup(req, db, user, isAuth, TENANTID);

    return singleResponse(data);

}