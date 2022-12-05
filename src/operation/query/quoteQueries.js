const { getQuoteListController } = require("../../controllers");


// Quote BASED QUERY
module.exports = {
    // GET Quote LIST QUERIES
    getQuoteList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getQuoteListController(db, user, isAuth, TENANTID);
    },

}