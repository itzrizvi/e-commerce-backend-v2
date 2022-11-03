const { createCartController, removeCartItemController, addSingleCartItemController, removeCartController } = require("../../controllers");

module.exports = {
    addCart: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        return await createCartController(args.data, db, user, isAuth, TENANTID);
    },
    removeCartItem: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        return await removeCartItemController(args.data, db, user, isAuth, TENANTID);
    },
    addSingleCartItem: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        return await addSingleCartItemController(args.data, db, user, isAuth, TENANTID);
    },
    removeCart: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        return await removeCartController(args.data, db, user, isAuth, TENANTID);
    },
}