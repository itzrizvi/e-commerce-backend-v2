// Require Controllers
const { adminSignInController, adminSignUpController } = require("../../controllers")



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
    },
    // Admin Sign Up From Admin Panel
    adminSignUp: async (root, args, { db, user, isAuth }, info) => {
        // Return If No Auth and No Role
        if (!user || !isAuth) return { message: "Not Authorized", email: args.data.email };
        if (user.role_no === '0') return { message: "Not Authorized", email: args.data.email };

        // CHECK ACCESS
        const roleNo = user.role_no;
        const checkRoleForAccess = await db.roles.findOne({ where: { role_no: roleNo } });

        // CHECK ACCESS
        if (!checkRoleForAccess) return { message: "Not Authorized", email: args.data.email };

        // Return To Controller
        return await adminSignUpController(args.data, db, user, isAuth);

    }
}