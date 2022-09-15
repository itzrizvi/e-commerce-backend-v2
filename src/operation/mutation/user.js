const { userSignUpController,
    userSignInController,
    emailVerifyController,
    resendVerificationEmailController } = require('../../controllers');


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
    }
}