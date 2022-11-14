// ALL REQUIRES
const { userProfileUpdate } = require("../../helpers/userHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, TENANTID) => {

    // Update Profile
    const data = await userProfileUpdate(req, db, user, TENANTID);

    return singleResponse(data);

}