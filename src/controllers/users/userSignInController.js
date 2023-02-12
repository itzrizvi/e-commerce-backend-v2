const path = require("path");
const { error } = require("winston");
const logger = require("../../../logger");
const { userSignIn } = require("../../helpers/userHelper");
const { singleResponse } = require("../../utils/response");


// Controller
module.exports = async (req, db, TENANTID) => {

    try {
        // Logger
        logger.info(
            error.message,
            {
                error: error,
                apiaction: 'User Sign In Controller Initating...',
                user_data: `${req.email}`,
                service: path.basename(__filename),
                module: `userSignInController`
            });

        const data = await userSignIn(req, db, TENANTID);
        return singleResponse(data);

    } catch (error) {
        // Logger
        logger.info(
            error.message,
            {
                error: error,
                apiaction: "Error Occurd",
                user_data: `${req.email}`,
                service: path.basename(__filename),
                module: `userSignInController`
            });

        if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };
    }


}