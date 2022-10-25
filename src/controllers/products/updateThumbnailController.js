// All Requires
const { updateThumbnail } = require("../../helpers/productHelper");
const { updateThumbnailRequest } = require("../../requests/productRequests");
const { singleResponse } = require("../../utils/response");


// UPDATE PRODUCT THUMBNAIL CONTROLLER
module.exports = async (req, db, TENANTID) => {

    // Validate Add Product Request
    const validate = await updateThumbnailRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }
    // Sending Request to Helper
    const data = await updateThumbnail(req, db, TENANTID);

    // Final Response
    return singleResponse(data);
}