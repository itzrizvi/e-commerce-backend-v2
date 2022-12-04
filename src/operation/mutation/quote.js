// All Requires
const { addToQuoteController } = require("../../controllers");


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

}