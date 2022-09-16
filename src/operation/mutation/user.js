// All Requires
const { userSignUpController,
    userSignInController,
    emailVerifyController,
    resendVerificationEmailController,
    forgotPasswordController } = require('../../controllers');

const { forgotPasswordInitController,
    forgotPasswordCodeMatchController,
    forgotPasswordFinalController } = forgotPasswordController;


module.exports = {
    // SIGN UP MUTATION
    userSignUp: async (root, args, { db }, info) => {
        return await userSignUpController(args.data, db);
    },
    // SIGN IN MUTATION
    userSignIn: async (root, { email, password }, { db }, info) => {
        const data = {
            email,
            password
        }
        return await userSignInController(data, db);
    },
    // Verify Email MUTATION
    verifyEmail: async (root, args, { db, user, isAuth }, info) => {
        return await emailVerifyController(args.data, db, user, isAuth);
    },
    // Resend Verification Email MUTATION
    resendVerificationEmail: async (root, args, { db, user, isAuth }, info) => {
        return await resendVerificationEmailController(args.data, db, user, isAuth);
    },
    // Forgot Password Initiation (FP STEP 1)
    forgotPassInit: async (root, args, { db }, info) => {
        return await forgotPasswordInitController(args.data, db);
    },
    // Forgot Password Code Match Mutation (FP STEP 2)
    forgotPassCodeMatch: async (root, args, { db }, info) => {
        return await forgotPasswordCodeMatchController(args.data, db);
    },
    // Forgot Password Final (FP STEP 3)
    forgotPassFinal: async (root, args, { db }, info) => {
        return await forgotPasswordFinalController(args.data, db);
    }
}