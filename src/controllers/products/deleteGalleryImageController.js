// All Requires
const { deleteGalleryImage } = require("../../helpers/productHelper");
const { deleteGalleryImageRequest } = require("../../requests/productRequests");
const { singleResponse } = require("../../utils/response");


// UPDATE PRODUCT THUMBNAIL CONTROLLER
module.exports = async (req, db, TENANTID) => {

    // Validate Add Product Request
    const validate = await deleteGalleryImageRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }
    // Sending Request to Helper
    const data = await deleteGalleryImage(req, db, TENANTID);

    // Final Response
    return singleResponse(data);
}