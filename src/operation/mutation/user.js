// All Requires
const { error } = require('winston');
const logger = require('../../../logger');
const { userSignUpController,
    userSignInController,
    emailVerifyController,
    resendVerificationEmailController,
    validateToken,
    forgotPasswordController,
    userProfileUpdateController } = require('../../controllers');

const { forgotPasswordInitController,
    forgotPasswordCodeMatchController,
    forgotPasswordFinalController } = forgotPasswordController;


module.exports = {
    // SIGN UP MUTATION
    userSignUp: async (root, args, { db, TENANTID }, info) => {
        try {
            // Logger
            logger.info(error.message, { error: error, apiaction: 'User Sign Up Data Received In Mutation', user_data: `${args.data.email}`, service: `user.js`, line: 22, module: `userSignUp` });

            // Return If Not Have TENANT ID
            if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
            return await userSignUpController(args.data, db, TENANTID);

        } catch (error) {
            // Logger
            logger.info(error.message, { error: error, apiaction: "Error Occurd", user_data: `${email}`, service: `user.js`, line: 26, module: `userSignIn` });
        }
    },
    // SIGN IN MUTATION
    userSignIn: async (root, { email, password }, { db, TENANTID }, info) => {
        try {
            // Logger
            logger.info(error.message, { error: error, apiaction: `User Sign In Data Received In Mutation`, user_data: `${email}`, service: `user.js`, line: 26, module: `userSignIn` });
            // Return If Not Have TENANT ID
            if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
            const data = {
                email,
                password
            }
            return await userSignInController(data, db, TENANTID);

        } catch (error) {
            // Logger
            logger.info(error.message, { error: error, apiaction: "Error Occurd", user_data: `${email}`, service: `user.js`, line: 26, module: `userSignIn` });
        }

    },
    // Verify Email MUTATION
    verifyEmail: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        try {
            // Logger
            logger.info(error.message, { error: error, apiaction: `Verify Email Data Received In Mutation`, user_data: `${args.data.email}`, service: `user.js`, line: 56, module: `verifyEmail` });

            // Return If Not Have TENANT ID
            if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

            return await emailVerifyController(args.data, db, TENANTID);
        } catch (error) {
            // Logger
            logger.info(error.message, { error: error, apiaction: "Error Occurd", user_data: `${args.data.email}`, service: `user.js`, line: 64, module: `verifyEmail` });
        }
    },
    // Resend Verification Email MUTATION
    resendVerificationEmail: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        try {
            // Logger
            logger.info(error.message, { error: error, apiaction: `Resend Verify Email Data Received In Mutation`, user_data: `${args.data.email}`, service: `user.js`, line: 56, module: `resendVerificationEmail` });

            // Return If Not Have TENANT ID
            if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

            return await resendVerificationEmailController(args.data, db, TENANTID);
        } catch (error) {
            // Logger
            logger.info(error.message, { error: error, apiaction: "Error Occurd", user_data: `${args.data.email}`, service: `user.js`, line: 79, module: `resendVerificationEmail` });
        }
    },
    // Forgot Password Initiation (FP STEP 1)
    forgotPassInit: async (root, args, { db, TENANTID }, info) => {
        try {
            // Logger
            logger.info(
                error.message,
                {
                    error: error,
                    apiaction: `Forgot Password Data Received In Mutation`,
                    user_data: `${args.data.email}`,
                    service: `user.js`,
                    line: 93,
                    module: `forgotPassInit`
                });

            // Return If Not Have TENANT ID
            if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

            return await forgotPasswordInitController(args.data, db, TENANTID);
        } catch (error) {
            // Logger
            logger.info(
                error.message,
                {
                    error: error,
                    apiaction: "Error Occurd",
                    user_data: `${args.data.email}`,
                    service: `user.js`,
                    line: 110,
                    module: `forgotPassInit`
                });
        }
    },
    // Forgot Password Code Match Mutation (FP STEP 2)
    forgotPassCodeMatch: async (root, args, { db, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        return await forgotPasswordCodeMatchController(args.data, db, TENANTID);
    },
    // Forgot Password Final (FP STEP 3)
    forgotPassFinal: async (root, args, { db, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        return await forgotPasswordFinalController(args.data, db, TENANTID);
    },
    // Token Validate
    validateToken: async (root, args, { db, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        return await validateToken(args.token, db);
    },
    // User Profile Update MUTATION
    userProfileUpdate: async (root, args, { db, user, isAuth, TENANTID }, info) => {

        try {
            // Logger
            logger.info(
                error.message,
                {
                    error: error,
                    apiaction: `Update Profile Data Received In Mutation`,
                    user_data: `${user.email}`,
                    service: `user.js`,
                    line: 147,
                    module: `userProfileUpdate`
                });
            // Return If Not Have TENANT ID
            if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

            if (!user || !isAuth) return { message: "Not Authorized", status: false };

            return await userProfileUpdateController(args.data, db, user, TENANTID);

        } catch (error) {
            // Logger
            logger.info(
                error.message,
                {
                    error: error,
                    apiaction: "Error Occurd",
                    user_data: `${user.email}`,
                    service: `user.js`,
                    line: 166,
                    module: `userProfileUpdate`
                });
        }
    },
}