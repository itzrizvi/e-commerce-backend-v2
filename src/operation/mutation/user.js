// All Requires
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
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        return await userSignUpController(args.data, db, TENANTID);
    },
    // SIGN IN MUTATION
    userSignIn: async (root, { email, password }, { db, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        const data = {
            email,
            password
        }
        return await userSignInController(data, db, TENANTID);
    },
    // Verify Email MUTATION
    verifyEmail: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }


        return await emailVerifyController(args.data, db, TENANTID);
    },
    // Resend Verification Email MUTATION
    resendVerificationEmail: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        return await resendVerificationEmailController(args.data, db, TENANTID);
    },
    // Forgot Password Initiation (FP STEP 1)
    forgotPassInit: async (root, args, { db, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        return await forgotPasswordInitController(args.data, db, TENANTID);
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
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        if (!user || !isAuth) return { message: "Not Authorized", status: false };

        return await userProfileUpdateController(args.data, db, user, TENANTID);
    },
}