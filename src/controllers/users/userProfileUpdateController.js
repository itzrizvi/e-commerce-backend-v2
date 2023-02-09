// ALL REQUIRES
const { error } = require("winston");
const logger = require("../../../logger");
const { userProfileUpdate } = require("../../helpers/userHelper");
const { singleResponse } = require("../../utils/response");


// CONTROLLER
module.exports = async (req, db, user, TENANTID) => {

    try {
        // Logger
        logger.info(
            error.message,
            {
                error: error,
                apiaction: 'User Profile Update Controller Initating...',
                user_data: `${req.email}`,
                service: `userProfileUpdateController.js`,
                module: `userProfileUpdateController`
            });

        // Update Profile
        const data = await userProfileUpdate(req, db, user, TENANTID);

        return singleResponse(data);

    } catch (error) {

        // Logger
        logger.info(
            error.message,
            {
                error: error,
                apiaction: "Error Occurd",
                user_data: `${req.email}`,
                service: `userProfileUpdateController.js`,
                module: `userProfileUpdateController`
            });

        if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };

    }

}