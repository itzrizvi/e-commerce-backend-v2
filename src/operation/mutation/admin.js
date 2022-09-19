// Require Controllers
const { adminSignInController } = require("../../controllers")



// Admin Mutation 
module.exports = {
    // Admin Sign In
    adminSignIn: async (root, { email, password }, { db }, info) => {
        // Data from ARGS
        const data = {
            email,
            password
        }
        return await adminSignInController(data, db);
    }
}