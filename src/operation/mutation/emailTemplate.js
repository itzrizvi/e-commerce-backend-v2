// All Requires
const { addEmailTemplateOnListController } = require("../../controllers");


// Email Template Mutation Start
module.exports = {
    // Add Email Template on List Mutation
    addEmailTemplateOnList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await addEmailTemplateOnListController(args.data, db, user, isAuth, TENANTID);
    },

}
