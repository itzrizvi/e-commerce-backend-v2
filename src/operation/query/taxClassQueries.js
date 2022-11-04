const { getSingleTaxClassAdminController,
    getSingleTaxClassPublicController,
    getTaxClassListController } = require("../../controllers");


// Tax Class BASED QUERY
module.exports = {
    // GET SINGLE TAX CLASS QUERIES
    getSingleTaxClassAdmin: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getSingleTaxClassAdminController(args.query, db, user, isAuth, TENANTID);
    },
    // GET SINGLE TAX CLASS PUBLIC QUERIES
    getSingleTaxClassPublic: async (root, args, { db, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return To Controller
        return await getSingleTaxClassPublicController(args.query, db, TENANTID);
    },
    // GET TAX CLASS LIST QUERIES
    getTaxClassList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getTaxClassListController(db, TENANTID);
    },

}