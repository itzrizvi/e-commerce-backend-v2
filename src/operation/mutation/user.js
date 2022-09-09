const { userSignUpController, userSignInController } = require('../../controllers');


module.exports = {
    userSignUp: async (root, args, { db }, info) => {
        return await userSignUpController(args.data, db);
    },
    userSignIn: async (root, { email, password }, { db }, info) => {
        const data = {
            email,
            password
        }
        return await userSignInController(data, db);
    }
}