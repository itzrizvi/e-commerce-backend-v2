const { getCartController } = require("../../controllers");

module.exports = {
    getCart: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        // Return To Controller
        return await getCartController(args.query, db, user, isAuth, TENANTID);
    }
}