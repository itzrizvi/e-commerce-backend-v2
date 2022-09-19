const { adminSignInController } = require("../../controllers")



// Admin Mutation 
module.exports = {
    // Admin Sign In
    adminSignIn: async (root, { email, password }, { db }, info) => {
        //
        const data = {
            email,
            password
        }
        return await adminSignInController(data, db);
    }
}