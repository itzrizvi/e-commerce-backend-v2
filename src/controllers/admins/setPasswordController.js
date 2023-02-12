// All Requires
const path = require("path");
const { error } = require("winston");
const logger = require("../../../logger");
const { setPassword } = require("../../helpers/adminHelper");
const { decrypt } = require("../../utils/hashes");
const { singleResponse } = require("../../utils/response");



// CONTROLLER
module.exports = async (req, db, TENANTID) => {

    try {

        // Logger
        logger.info(
            error.message,
            {
                error: error,
                apiaction: 'Set Password Controller Initating...',
                user_data: `${decrypt(req.codeHashed)}`,
                service: path.basename(__filename),
                module: `setPasswordController`
            });

        // Send to Helper
        const data = await setPassword(req, db, TENANTID);

        return singleResponse(data);

    } catch (error) {

        // Logger
        logger.info(
            error.message,
            {
                error: error,
                apiaction: "Error Occurd",
                user_data: `${decrypt(req.codeHashed)}`,
                service: path.basename(__filename),
                module: `setPasswordController`
            });

        if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };

    }


}