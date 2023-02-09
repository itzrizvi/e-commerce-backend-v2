const { Op } = require("sequelize");
const { error } = require("winston");
const logger = require("../../../logger");
const { userSignUp } = require("../../helpers/userHelper");
const { singleResponse } = require("../../utils/response");



// Sign Up Controller Export
module.exports = async (req, db, TENANTID) => {

    try {
        // Logger
        logger.info(
            error.message,
            {
                error: error,
                apiaction: 'User Sign Up Controller Initating...',
                user_data: `${req.email}`,
                service: `userSignUpController.js`,
                module: `userSignUpController`
            });

        // Check Email Is Already Taken or Not
        const checkEmail = await db.user.findOne({
            where: {
                [Op.and]: [{
                    email: req.email,
                    tenant_id: TENANTID
                }]
            }
        });

        // Logger
        logger.info(
            error.message,
            {
                error: error,
                apiaction: 'User Email Checked...',
                user_data: `${req.email}`,
                service: `userSignUpController.js`,
                module: `userSignUpController`
            });

        // If Not Exists then create User
        if (!checkEmail) {
            // Logger
            logger.info(
                error.message,
                {
                    error: error,
                    apiaction: 'New User Found...',
                    user_data: `${req.email}`,
                    service: `userSignUpController.js`,
                    module: `userSignUpController`
                });

            const data = await userSignUp(req, db, TENANTID);
            return singleResponse(data);

        } else { // Else Send Error Message

            // Logger
            logger.info(
                error.message,
                {
                    error: error,
                    apiaction: 'User Already Exists....',
                    user_data: `${req.email}`,
                    service: `userSignUpController.js`,
                    module: `userSignUpController`
                });

            const data = {
                message: "Email Is Already Taken",
                status: false
            }

            return singleResponse(data);
        }

    } catch (error) {
        // Logger
        logger.info(
            error.message,
            {
                error: error,
                apiaction: "Error Occurd",
                user_data: `${req.email}`,
                service: `userSignUpController.js`,
                module: `userSignUpController`
            });

        if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };

    }
}