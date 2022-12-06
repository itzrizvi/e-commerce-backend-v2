// All Requires
const { addToQuoteController,
    submitQuoteController,
    quoteSyncController,
    quoteItemDeleteController,
    updateSubmittedQuoteController } = require("../../controllers");


// Quote Mutation Start
module.exports = {
    // Add To Quote Mutation
    addToQuote: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };

        // Send to Controller
        return await addToQuoteController(args.data, db, user, isAuth, TENANTID);
    },
    // Quote Item Delete Mutation
    quoteItemDelete: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };

        // Send to Controller
        return await quoteItemDeleteController(args.data, db, user, isAuth, TENANTID);
    },
    // Submit Quote Mutation
    submitQuote: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };

        // Send to Controller
        return await submitQuoteController(args.data, db, user, isAuth, TENANTID);
    },
    // Quote Sync From Guest User To Registered User Mutation
    quoteSync: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };

        // Send to Controller
        return await quoteSyncController(args.data, db, user, isAuth, TENANTID);
    },
    // Submitted Quote Update Mutation
    updateSubmittedQuote: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await updateSubmittedQuoteController(args.data, db, user, isAuth, TENANTID);
    },

}
