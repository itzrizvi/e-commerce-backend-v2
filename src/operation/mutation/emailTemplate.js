// All Requires
const { addEmailTemplateOnListController,
    updateEmailTemplateOnListController,
    addEmailTempHeaderFooterController,
    updateEmailTempHeaderFooterController,
    createEmailTemplateController,
    updateEmailTemplateController } = require("../../controllers");


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
    // Update Email Template on List Mutation
    updateEmailTemplateOnList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await updateEmailTemplateOnListController(args.data, db, user, isAuth, TENANTID);
    },
    // Add Email Template Header Footer Mutation
    addEmailTempHeaderFooter: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await addEmailTempHeaderFooterController(args.data, db, user, isAuth, TENANTID);
    },
    // Update Email Template Header Footer Mutation
    updateEmailTempHeaderFooter: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await updateEmailTempHeaderFooterController(args.data, db, user, isAuth, TENANTID);
    },
    // Add Email Template  Mutation
    createEmailTemplate: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await createEmailTemplateController(args.data, db, user, isAuth, TENANTID);
    },
    // Update Email Template  Mutation
    updateEmailTemplate: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await updateEmailTemplateController(args.data, db, user, isAuth, TENANTID);
    },

}
