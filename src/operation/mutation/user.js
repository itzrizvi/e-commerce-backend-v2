const { userSignUpController,
    userSignInController,
    emailVerifyController,
    resendVerificationEmailController,
    forgotPasswordController } = require('../../controllers');

const { forgotPasswordInitController, forgotPasswordCodeMatchController } = forgotPasswordController;


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
    // Forgot Password Initiation
    forgotPassInit: async (root, args, { db }, info) => {
        return await forgotPasswordInitController(args.data, db);
    },
    // Forgot Password Code Match Mutation
    forgotPassCodeMatch: async (root, args, { db }, info) => {
        return await forgotPasswordCodeMatchController(args.data, db);
    }
}