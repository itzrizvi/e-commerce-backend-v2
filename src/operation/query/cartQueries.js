const { getCartController, getSingleCartController } = require("../../controllers");

module.exports = {
    getCart: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return To Controller
        return await getCartController(args.query, db, user, isAuth, TENANTID);
    },
    getSingleCartItem: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return To Controller
        return await getSingleCartController(args.query, db, user, isAuth, TENANTID);
    }
}