const { stripePaymentIntentController } = require("../../controllers");


// Tax Class BASED QUERY
module.exports = {
    // GET SINGLE TAX CLASS QUERIES
    stripePaymentIntent: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        // Return To Controller
        return await stripePaymentIntentController(args.query, db, user, isAuth);
    },

}