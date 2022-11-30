// All Requires
const { updateReceivingController } = require("../../controllers");


// Receiving Product Mutation Start
module.exports = {
    // UPDATE Mutation
    updateReceiving: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await updateReceivingController(args.data, db, user, isAuth, TENANTID);
    },

}