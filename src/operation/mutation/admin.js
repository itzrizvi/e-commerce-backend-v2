// Require Controllers
const path = require("path");
const { error } = require("winston");
const logger = require("../../../logger")
const { adminSignInController,
    adminSignUpController,
    setPasswordController,
    resetPasswordController } = require("../../controllers");
const { decrypt } = require("../../utils/hashes");



// Admin Auth Based Mutation 
module.exports = {
    // Admin Sign In
    adminSignIn: async (root, { email, password }, { db, TENANTID, ip }, info) => {
        try {
            // Logger
            logger.info(
                error.message,
                {
                    error: error,
                    apiaction: `Admin User Sign In Data Received In Mutation`,
                    user_data: `${email}`,
                    service: path.basename(__filename),
                    module: `adminSignIn`
                });

            // Return If Not Have TENANT ID
            if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

            // Data from ARGS
            const data = {
                email,
                password
            }
            return await adminSignInController(data, db, TENANTID);

        } catch (error) {
            // Logger
            logger.info(
                error.message,
                {
                    error: error,
                    apiaction: "Error Occurd",
                    user_data: `${email}`,
                    service: path.basename(__filename),
                    module: `adminSignIn`
                });

            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };

        }

    },
    // Admin Sign Up From Admin Panel
    adminSignUp: async (root, args, { db, user, isAuth, TENANTID }, info) => {

        try {
            // Logger
            logger.info(
                error.message,
                {
                    error: error,
                    apiaction: `Admin User Sign Up Data Received In Mutation`,
                    user_data: `${args.data.email}`,
                    service: path.basename(__filename),
                    module: `adminSignUp`
                });

            // Return If Not Have TENANT ID
            if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

            // Return If No Auth and No Role
            if (!user || !isAuth) return { message: "Not Authorized", email: args.data.email, status: false };
            if (user.has_role === '0') return { message: "Not Authorized", email: args.data.email, status: false };

            // Return To Controller
            return await adminSignUpController(args.data, db, user, isAuth, TENANTID);

        } catch (error) {
            // Logger
            logger.info(
                error.message,
                {
                    error: error,
                    apiaction: "Error Occurd",
                    user_data: `${args.data.email}`,
                    service: path.basename(__filename),
                    module: `adminSignUp`
                });

            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };
        }


    },
    // Set/Reset Password
    setPassword: async (root, args, { db, TENANTID }, info) => {
        try {

            // Logger
            logger.info(
                error.message,
                {
                    error: error,
                    apiaction: `Set or Reset Password Data Received In Mutation`,
                    user_data: `${decrypt(args.data.codeHashed)}`,
                    service: path.basename(__filename),
                    module: `setPassword`
                });

            // Return If Not Have TENANT ID
            if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false };
            // Return To Controller
            return await setPasswordController(args.data, db, TENANTID);

        } catch (error) {

            // Logger
            logger.info(
                error.message,
                {
                    error: error,
                    apiaction: "Error Occurd",
                    user_data: `${decrypt(args.data.codeHashed)}`,
                    service: path.basename(__filename),
                    module: `setPassword`
                });

            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };

        }

    },
    // Reset Password
    resetPassword: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        try {

            // Logger
            logger.info(
                error.message,
                {
                    error: error,
                    apiaction: `Reset Password Data Received In Mutation`,
                    user_data: `${user.email}`,
                    service: path.basename(__filename),
                    module: `resetPassword`
                });

            // Return If Not Have TENANT ID
            if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false };
            // Return If No Auth and No Role
            if (!user || !isAuth) return { message: "Not Authorized", email: args.data.email, status: false };
            if (user.has_role === '0') return { message: "Not Authorized", email: args.data.email, status: false };

            // Return To Controller
            return await resetPasswordController(args.data, db, user, isAuth, TENANTID);

        } catch (error) {

            // Logger
            logger.info(
                error.message,
                {
                    error: error,
                    apiaction: `Reset Password Data Received In Mutation`,
                    user_data: `${user.email}`,
                    service: path.basename(__filename),
                    module: `resetPassword`
                });

            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };

        }

    },
}