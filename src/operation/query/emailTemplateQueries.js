const { getAllEmailTemplateListController,
    getSingleEmailTemplateListController,
    getSingleEmailTempHeaderFooterController } = require("../../controllers");


// Email Template BASED QUERY
module.exports = {
    // GET EMAIL TEMPLATE LIST QUERIES
    getAllEmailTemplateList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getAllEmailTemplateListController(db, TENANTID);
    },
    // GET SINGLE EMAIL TEMPLATE LIST QUERIES
    getSingleEmailTemplateList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getSingleEmailTemplateListController(args.query, db, user, isAuth, TENANTID);
    },
    // GET SINGLE EMAIL TEMPLATE HEADER FOOTER QUERIES
    getSingleEmailTempHeaderFooter: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getSingleEmailTempHeaderFooterController(args.query, db, user, isAuth, TENANTID);
    },

}