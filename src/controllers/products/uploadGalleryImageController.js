// All Requires
const { uploadGalleryImage } = require("../../helpers/productHelper");
const { uploadGalleryImageRequest } = require("../../requests/productRequests");
const { singleResponse } = require("../../utils/response");


// UPDATE PRODUCT THUMBNAIL CONTROLLER
module.exports = async (req, db, TENANTID) => {

    // Validate Add Product Request
    const validate = await uploadGalleryImageRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }
    // Sending Request to Helper
    const data = await uploadGalleryImage(req, db, TENANTID);

    // Final Response
    return singleResponse(data);
}