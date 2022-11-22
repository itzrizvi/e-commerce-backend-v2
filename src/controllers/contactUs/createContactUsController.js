// ALL REQUIRES;
const { createContactUs } = require("../../helpers/contactUsHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, TENANTID) => {

    // SEND TO HELPER
    const data = await createContactUs(req, db, TENANTID);

    return singleResponse(data);

}