// Require Controllers
const { adminSignInController, adminSignUpController } = require("../../controllers")



// Admin Auth Based Mutation 
module.exports = {
    // Admin Sign In
    adminSignIn: async (root, { email, password }, { db, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Data from ARGS
        const data = {
            email,
            password
        }
        return await adminSignInController(data, db, TENANTID);
    },
    // Admin Sign Up From Admin Panel
    adminSignUp: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth and No Role
        if (!user || !isAuth) return { message: "Not Authorized", email: args.data.email, status: false };
        if (user.has_role === '0') return { message: "Not Authorized", email: args.data.email, status: false };


        // Return To Controller
        return await adminSignUpController(args.data, db, user, isAuth, TENANTID);

    }
}