// Require Controllers
const logger = require("../../../logger")
const { adminSignInController,
    adminSignUpController,
    setPasswordController,
    resetPasswordController } = require("../../controllers")



// Admin Auth Based Mutation 
module.exports = {
    // Admin Sign In
    adminSignIn: async (root, { email, password }, { db, TENANTID, ip }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) {
            logger.warning("Tenant ID Is Missing", { service: 'admin.js', ip: ip, line: "16" });
            return { message: "TENANT ID IS MISSING!!!", status: false }
        }
        logger.http("Admin Sign In Requested", { service: 'Mutation - admin.js', ip: ip });
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
        if (!TENANTID) {
            logger.warning("Tenant ID Is Missing", { service: 'admin.js', ip: ip, line: "31" });
            return { message: "TENANT ID IS MISSING!!!", status: false }
        }
        // Return If No Auth and No Role
        if (!user || !isAuth) return { message: "Not Authorized", email: args.data.email, status: false };
        if (user.has_role === '0') return { message: "Not Authorized", email: args.data.email, status: false };


        // Return To Controller
        return await adminSignUpController(args.data, db, user, isAuth, TENANTID);

    },
    // Set/Reset Password
    setPassword: async (root, args, { db, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false };

        // Return To Controller
        return await setPasswordController(args.data, db, TENANTID);
    },
    // Reset Password
    resetPassword: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false };
        // Return If No Auth and No Role
        if (!user || !isAuth) return { message: "Not Authorized", email: args.data.email, status: false };
        if (user.has_role === '0') return { message: "Not Authorized", email: args.data.email, status: false };

        // Return To Controller
        return await resetPasswordController(args.data, db, user, isAuth, TENANTID);
    },
}